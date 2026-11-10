import { useCallback, useEffect, useRef, useState } from 'react';
import { useInterval } from '@monkvision/common';
import { useOcr, OCR_STABILIZER_CONFIG, createCanvas, get2dContext } from '@monkvision/ml-web';
import { MonkPicture, MileageUnit, OcrMode } from '@monkvision/types';
import { PhotoCaptureOcrConfig } from '../../../hooks';
import { parseOdometerText } from '../PhotoCaptureHUDOcrText.utils';
import { getCropRegion } from '../PhotoCaptureHUDOcrOverlay.styles';

const FALLBACK_OCR_READ_TIMEOUT_MS = 8_000;

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/;

function isValidVinFormat(vin: string): boolean {
  const normalized = vin.trim().toUpperCase();
  return VIN_PATTERN.test(normalized);
}

function canvasToBlob(
  canvas: OffscreenCanvas | HTMLCanvasElement,
  mimetype: string,
  quality: number,
): Promise<Blob> {
  if (canvas instanceof HTMLCanvasElement) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob returned null'))),
        mimetype,
        quality,
      );
    });
  }
  return canvas.convertToBlob({ type: mimetype, quality });
}

export interface UsePhotoCaptureHUDOcrOverlayParams {
  /** OCR and capture configuration (models, intervals, retry limits). */
  config: PhotoCaptureOcrConfig;
  /** Returns the current camera frame as ImageData for live OCR processing. */
  getImageData: () => ImageData;
  /** When true, the camera is still initializing and frame capture should be skipped. */
  isCameraLoading: boolean;
  /** When false, the hook is inactive (non-OCR sight selected). */
  isActive: boolean;
  /** Actual rendered pixel dimensions of the video content on screen. */
  previewDimensions: { width: number; height: number } | null;
  /** OCR mode active for the current sight. */
  mode?: OcrMode;
  /** Fallback unit used when OCR cannot detect one from the text (odometer mode only). */
  defaultMileageUnit?: MileageUnit;
  /** Called when the user confirms the OCR-detected text. */
  onConfirm?: (
    text: string,
    picture: MonkPicture,
    mode: OcrMode | undefined,
    defaultMileageUnit: MileageUnit | undefined,
  ) => void;
  /** Called when the user rejects the OCR-detected text. */
  onReject?: () => void;
  /** Called once when the retry/timeout limit is reached. */
  onFallbackReady?: () => void;
  /** Full-frame picture taken by the user in fallback mode. */
  fallbackPicture?: MonkPicture | null;
  /** Current sight ID — used to reset OCR state when the active sight changes. */
  sightId?: string;
}

export interface UsePhotoCaptureHUDOcrOverlayHandle {
  /** Whether the retry/timeout limit has been reached and the shutter is unlocked. */
  isFallbackReady: boolean;
  /** Normalized crop region as fractions of the preview dimensions. */
  cropRegion: ReturnType<typeof getCropRegion>;
  /** Cropped picture shown in the confirmation modal; null while scanning. */
  ocrPicture: MonkPicture | null;
  /** Whether the modal is in manual text-edit mode. */
  isEditing: boolean;
  /** Current value of the manual edit input. */
  editText: string;
  /** Currently selected mileage unit (odometer mode only). */
  selectedUnit: MileageUnit;
  /** Whether the user submitted an invalid VIN during manual edit. */
  isManualVinError: boolean;
  /** Whether fallback OCR failed to confirm text within the timeout. */
  fallbackOcrFailed: boolean;
  /** Whether the fallback OCR interval is active. */
  hasFallbackImageData: boolean;
  /** Confirmed text from the OCR stabilizer; null while scanning. */
  confirmedText: string | null;
  /** Number of consecutive consistent readings so far. */
  consistencyCount: number;
  /** Whether the confirmation modal should be shown. */
  showModal: boolean;
  /** Display text for the modal (formatted number for odometer, raw VIN otherwise). */
  modalText: string;
  /** Whether the confirmed reading is out of valid range. */
  isInvalidReading: boolean;
  /** Whether OCR is currently processing the fallback image. */
  isOcrLoading: boolean;
  /** Whether OCR has confirmed a reading. */
  isConfirmed: boolean;
  /**
   * Fraction of the crop-box perimeter to fill with the progress arc (0 → 1).
   * Reaches 1 on confirmation and drops to 0 in fallback mode.
   */
  fillFraction: number;
  /** Confirm the current reading and forward it to the parent. */
  handleConfirm: () => void;
  /** Reject the current reading and either retry or enter fallback mode. */
  handleRejection: () => void;
  /** Cancel manual edit and restart scanning. */
  handleEditCancel: () => void;
  /** Handle closing the invalid-reading error (VIN or odometer out of range). */
  handleInvalidReadingClose: () => void;
  /** Handle dismissing OCR failure — passes through the picture without text. */
  handleOcrFailed: () => void;
  /** Update the manual edit input value. */
  handleEditChange: (v: string) => void;
  /** Update the selected mileage unit (odometer mode only). */
  handleUnitChange: (unit: MileageUnit) => void;
}

/** Drives the OCR state machine for the camera overlay — all state, effects, and handlers. */
export function usePhotoCaptureHUDOcrOverlay({
  config,
  getImageData,
  isCameraLoading,
  isActive,
  previewDimensions,
  mode,
  defaultMileageUnit,
  onConfirm,
  onReject,
  onFallbackReady,
  fallbackPicture,
  sightId,
}: UsePhotoCaptureHUDOcrOverlayParams): UsePhotoCaptureHUDOcrOverlayHandle {
  const {
    captureIntervalMs = OCR_STABILIZER_CONFIG.captureIntervalMs,
    appearanceCount = OCR_STABILIZER_CONFIG.appearanceCount,
    maxOcrRetries = 2,
    ocrTimeoutMs = 20_000,
    ...ocrConfig
  } = config;

  const { isReady, loadModels, processFrame, confirmedText, consistencyCount, reset, fatalError } =
    useOcr({ ...ocrConfig, appearanceCount });

  const srcCanvasRef = useRef<OffscreenCanvas | HTMLCanvasElement | null>(null);
  const cropCanvasRef = useRef<OffscreenCanvas | HTMLCanvasElement | null>(null);
  const cropCoordsRef = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);
  const processedFallbackUriRef = useRef<string | null>(null);

  const [ocrPicture, setOcrPicture] = useState<MonkPicture | null>(null);

  // Revoke the previous blob URL whenever ocrPicture changes or the hook unmounts,
  // to avoid accumulating unreleased blob URLs across retries and confirmations.
  useEffect(() => {
    const uri = ocrPicture?.uri ?? null;
    return () => {
      if (uri) {
        URL.revokeObjectURL(uri);
      }
    };
  }, [ocrPicture]);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [hasFallbackImageData, setHasFallbackImageData] = useState(false);
  const [fallbackOcrFailed, setFallbackOcrFailed] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<MileageUnit>(
    defaultMileageUnit ?? MileageUnit.KM,
  );
  const [isManualVinError, setIsManualVinError] = useState(false);

  const isFallbackReady = retryCount >= maxOcrRetries || isTimedOut;
  const isPortrait = previewDimensions ? previewDimensions.height > previewDimensions.width : false;
  const cropRegion = getCropRegion(isPortrait);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const resetOcrState = useCallback(() => {
    reset();
    setOcrPicture(null);
    setIsEditing(false);
    setEditText('');
    setRetryCount(0);
    setIsTimedOut(false);
    processedFallbackUriRef.current = null;
    setHasFallbackImageData(false);
    setFallbackOcrFailed(false);
    setSelectedUnit(defaultMileageUnit ?? MileageUnit.KM);
    setIsManualVinError(false);
  }, [reset, defaultMileageUnit]);

  useEffect(() => {
    resetOcrState();
  }, [sightId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isActive) {
      resetOcrState();
    }
  }, [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timeout: if OCR hasn't confirmed within ocrTimeoutMs, unlock the shutter.
  useEffect(() => {
    if (!isActive || isFallbackReady || confirmedText !== null) {
      return undefined;
    }
    const timer = setTimeout(() => setIsTimedOut(true), ocrTimeoutMs);
    return () => clearTimeout(timer);
  }, [isActive, isFallbackReady, confirmedText, ocrTimeoutMs]);

  useEffect(() => {
    if (isFallbackReady) {
      onFallbackReady?.();
    }
  }, [isFallbackReady, onFallbackReady]);

  // A fatal worker error permanently stops inference; treat it as an immediate timeout.
  useEffect(() => {
    if (fatalError) {
      setIsTimedOut(true);
    }
  }, [fatalError]);

  // When a fallback picture arrives: show the confirm modal immediately, then run OCR in background.
  useEffect(() => {
    if (!fallbackPicture || !isFallbackReady) {
      return undefined;
    }
    if (processedFallbackUriRef.current === fallbackPicture.uri) {
      return undefined;
    }
    processedFallbackUriRef.current = fallbackPicture.uri;
    setFallbackOcrFailed(false);

    let cancelled = false;
    const img = new Image();
    img.src = fallbackPicture.uri;
    img.onload = () => {
      if (cancelled) {
        return;
      }
      const sw = Math.round(cropRegion.w * img.naturalWidth);
      const sh = Math.round(cropRegion.h * img.naturalHeight);
      const sx = Math.round(cropRegion.x * img.naturalWidth);
      const sy = Math.round(cropRegion.y * img.naturalHeight);

      if (
        !cropCanvasRef.current ||
        cropCanvasRef.current.width !== sw ||
        cropCanvasRef.current.height !== sh
      ) {
        cropCanvasRef.current = createCanvas(sw, sh);
      }
      const cropCtx = get2dContext(cropCanvasRef.current);
      cropCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

      const cropCanvas = cropCanvasRef.current;
      if (!cropCanvas) {
        return;
      }
      const mimetype = 'image/jpeg';
      canvasToBlob(cropCanvas, mimetype, 0.92)
        .then((blob) => {
          if (cancelled) {
            return;
          }
          const uri = URL.createObjectURL(blob);
          setOcrPicture({ blob, uri, mimetype, width: sw, height: sh });
          if (config.allowManualInput) {
            setIsEditing(true);
            setEditText('');
          }
        })
        .catch(() => {
          if (!cancelled) {
            setFallbackOcrFailed(true);
          }
        });

      reset();
      setHasFallbackImageData(true);
    };
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallbackPicture, isFallbackReady, config.allowManualInput]);

  useEffect(() => {
    if (isFallbackReady && confirmedText !== null) {
      setHasFallbackImageData(false);
    }
  }, [isFallbackReady, confirmedText]);

  // If OCR can't confirm within the timeout on the fallback image, declare failure.
  useEffect(() => {
    if (!hasFallbackImageData || confirmedText !== null) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setFallbackOcrFailed(true);
      setHasFallbackImageData(false);
    }, FALLBACK_OCR_READ_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [hasFallbackImageData, confirmedText]);

  useEffect(() => {
    if (mode !== OcrMode.ODOMETER || !confirmedText) {
      return;
    }
    const { unit } = parseOdometerText(confirmedText);
    if (unit !== null) {
      setSelectedUnit(unit);
    }
  }, [confirmedText, mode]);

  // In allowManualInput fallback mode, auto-populate editText when OCR confirms.
  useEffect(() => {
    if (isFallbackReady && isEditing && confirmedText && !editText) {
      if (mode === OcrMode.ODOMETER) {
        const { value } = parseOdometerText(confirmedText);
        setEditText(value !== null ? String(value) : '');
      } else {
        setEditText(confirmedText);
      }
    }
  }, [isFallbackReady, isEditing, confirmedText, editText, mode]);

  useEffect(() => {
    if (!confirmedText && !isFallbackReady) {
      setIsEditing(false);
      setEditText('');
    }
  }, [confirmedText, isFallbackReady]);

  useEffect(() => {
    if (!confirmedText || !cropCanvasRef.current || isFallbackReady) {
      return undefined;
    }
    let cancelled = false;
    const canvas = cropCanvasRef.current;
    const { width, height } = canvas;
    const mimetype = 'image/jpeg';
    canvasToBlob(canvas, mimetype, 0.92)
      .then((blob) => {
        if (cancelled) {
          return;
        }
        const uri = URL.createObjectURL(blob);
        setOcrPicture({ blob, uri, mimetype, width, height });
      })
      .catch(() => {
        if (!cancelled) {
          // Blob creation failed (e.g. CORS-tainted canvas, OOM). Reset so OCR can rescan
          // rather than leaving confirmedText set with no modal to surface it.
          reset();
        }
      });
    return () => {
      cancelled = true;
    };
  }, [confirmedText, isFallbackReady, reset]);

  useInterval(
    () => {
      if (isFallbackReady) {
        const canvas = cropCanvasRef.current;
        if (canvas) {
          processFrame(get2dContext(canvas).getImageData(0, 0, canvas.width, canvas.height));
        }
        return undefined;
      }
      if (!isReady || !isActive || isCameraLoading) {
        return undefined;
      }
      try {
        const full = getImageData();

        if (
          !cropCoordsRef.current ||
          srcCanvasRef.current?.width !== full.width ||
          srcCanvasRef.current?.height !== full.height
        ) {
          cropCoordsRef.current = {
            sx: Math.round(cropRegion.x * full.width),
            sy: Math.round(cropRegion.y * full.height),
            sw: Math.round(cropRegion.w * full.width),
            sh: Math.round(cropRegion.h * full.height),
          };
        }
        const { sx, sy, sw, sh } = cropCoordsRef.current;

        if (
          !srcCanvasRef.current ||
          srcCanvasRef.current.width !== full.width ||
          srcCanvasRef.current.height !== full.height
        ) {
          srcCanvasRef.current = createCanvas(full.width, full.height);
        }
        if (
          !cropCanvasRef.current ||
          cropCanvasRef.current.width !== sw ||
          cropCanvasRef.current.height !== sh
        ) {
          cropCanvasRef.current = createCanvas(sw, sh);
        }

        const srcCtx = get2dContext(srcCanvasRef.current);
        const cropCtx = get2dContext(cropCanvasRef.current);

        srcCtx.putImageData(full, 0, 0);
        cropCtx.drawImage(srcCanvasRef.current, sx, sy, sw, sh, 0, 0, sw, sh);
        processFrame(cropCtx.getImageData(0, 0, sw, sh));
      } catch {
        /* camera not ready */
      }
      return undefined;
    },
    isReady && isActive && (!isFallbackReady || hasFallbackImageData) ? captureIntervalMs : null,
  );

  const isOdometer = mode === OcrMode.ODOMETER;
  const isConfirmed = confirmedText !== null;
  const showModal = ocrPicture !== null && (isConfirmed || isFallbackReady);

  let fillFraction = consistencyCount / appearanceCount;
  if (isConfirmed) {
    fillFraction = 1;
  }
  if (isFallbackReady) {
    fillFraction = 0;
  }

  // Modal shows the number only for odometer (unit is sent to the API separately).
  let modalText = confirmedText ?? '';
  let isInvalidReading = false;
  if (isConfirmed && confirmedText && !isEditing) {
    if (isOdometer) {
      const { value } = parseOdometerText(confirmedText);
      if (value !== null) {
        modalText = value.toLocaleString('fr-FR');
      } else {
        isInvalidReading = true;
      }
    } else if (!isValidVinFormat(confirmedText)) {
      isInvalidReading = true;
    } else {
      modalText = confirmedText;
    }
  }

  const isOcrLoading = hasFallbackImageData && confirmedText === null;

  const handleConfirm = useCallback(() => {
    if (!ocrPicture) {
      return;
    }
    // Prevent sending a malformed VIN: manual edits bypass the OCR stabilizer's
    // format check, so validate here before forwarding to the API.
    if (mode === OcrMode.VIN && isEditing && !isValidVinFormat(editText)) {
      setIsManualVinError(true);
      return;
    }
    setIsManualVinError(false);
    onConfirm?.(isEditing ? editText : confirmedText ?? '', ocrPicture, mode, selectedUnit);
    setIsEditing(false);
    setEditText('');
    setOcrPicture(null);
    reset();
  }, [ocrPicture, mode, isEditing, editText, confirmedText, selectedUnit, onConfirm, reset]);

  const handleRejection = useCallback(() => {
    const newCount = retryCount + 1;
    setRetryCount(newCount);
    const nowFallback = newCount >= maxOcrRetries || isTimedOut;

    if (!nowFallback) {
      setOcrPicture(null);
      reset();
      onReject?.();
    } else if (config.allowManualInput) {
      setIsEditing(true);
      const rawEdit = confirmedText ?? '';
      if (isOdometer && rawEdit) {
        const { value } = parseOdometerText(rawEdit);
        setEditText(value !== null ? String(value) : '');
      } else {
        setEditText(rawEdit);
      }
    } else {
      setOcrPicture(null);
      reset();
      onReject?.();
    }
  }, [
    retryCount,
    maxOcrRetries,
    isTimedOut,
    config.allowManualInput,
    confirmedText,
    isOdometer,
    reset,
    onReject,
  ]);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
    setEditText('');
    setOcrPicture(null);
    reset();
    onReject?.();
  }, [reset, onReject]);

  const handleInvalidReadingClose = useCallback(() => {
    if (isManualVinError) {
      // VIN format error during manual edit — stay in edit mode so the user can fix it.
      setIsManualVinError(false);
    } else {
      handleRejection();
    }
  }, [isManualVinError, handleRejection]);

  const handleOcrFailed = useCallback(() => {
    if (ocrPicture) {
      onConfirm?.('', ocrPicture, mode, selectedUnit);
    }
    setFallbackOcrFailed(false);
    setIsEditing(false);
    setEditText('');
    setOcrPicture(null);
    reset();
  }, [ocrPicture, onConfirm, mode, selectedUnit, reset]);

  const handleEditChange = useCallback(
    (v: string) => {
      setEditText(v);
      if (isManualVinError) {
        setIsManualVinError(false);
      }
    },
    [isManualVinError],
  );

  const handleUnitChange = useCallback((unit: MileageUnit) => {
    setSelectedUnit(unit);
  }, []);

  return {
    isFallbackReady,
    cropRegion,
    ocrPicture,
    isEditing,
    editText,
    selectedUnit,
    isManualVinError,
    fallbackOcrFailed,
    hasFallbackImageData,
    confirmedText,
    consistencyCount,
    showModal,
    modalText,
    isInvalidReading,
    isOcrLoading,
    isConfirmed,
    fillFraction,
    handleConfirm,
    handleRejection,
    handleEditCancel,
    handleInvalidReadingClose,
    handleOcrFailed,
    handleEditChange,
    handleUnitChange,
  };
}
