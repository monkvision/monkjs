import { useEffect, useRef, useState } from 'react';
import { useInterval } from '@monkvision/common';
import { useOcr, OCR_STABILIZER_CONFIG, createCanvas, get2dContext } from '@monkvision/ml-web';
import { MonkPicture, MileageUnit } from '@monkvision/types';
import { OcrConfirmModal } from './OcrConfirmModal';
import { OcrMode, PhotoCaptureOcrConfig } from '../../hooks';
import { parseOdometerText } from './ocrText.utils';
import {
  getCropRegion,
  RADIUS,
  STROKE,
  COLOR_IDLE,
  COLOR_CONFIRMED,
  getPerimeter,
  getOverlayStyle,
  styles,
} from './OcrOverlay.styles';

export interface OcrOverlayProps {
  config: PhotoCaptureOcrConfig;
  getImageData: () => ImageData;
  isCameraLoading: boolean;
  isActive: boolean;
  /** Actual rendered pixel dimensions of the video content on screen (excluding letterbox bars). */
  previewDimensions: { width: number; height: number } | null;
  /** OCR mode active for the current sight (odometer, vin, …). */
  mode?: OcrMode;
  /** Fallback unit used when OCR cannot detect one from the text (odometer mode only). */
  defaultMileageUnit?: MileageUnit;
  /** Called when the user confirms the OCR-detected text in the modal. */
  onConfirm?: (
    text: string,
    picture: MonkPicture,
    mode: OcrMode | undefined,
    defaultMileageUnit: MileageUnit | undefined,
  ) => void;
  /** Called when the user rejects the OCR-detected text in the modal. */
  onReject?: () => void;
  /** Called once when the retry/timeout limit is reached — signals the parent to unlock the shutter. */
  onFallbackReady?: () => void;
  /** Full-frame picture taken by the user in fallback mode. OCR runs on its crop region. */
  fallbackPicture?: MonkPicture | null;
  /** Current sight ID — used to reset OCR state when the active sight changes. */
  sightId?: string;
}

export function OcrOverlay({
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
}: OcrOverlayProps) {
  const {
    captureIntervalMs = OCR_STABILIZER_CONFIG.captureIntervalMs,
    appearanceCount = OCR_STABILIZER_CONFIG.appearanceCount,
    maxOcrRetries = 2,
    ocrTimeoutMs = 20_000,
    ...ocrConfig
  } = config;
  const { isReady, loadModels, processFrame, confirmedText, consistencyCount, reset } = useOcr({
    ...ocrConfig,
    appearanceCount,
  });

  const srcCanvasRef = useRef<OffscreenCanvas | HTMLCanvasElement | null>(null);
  const cropCanvasRef = useRef<OffscreenCanvas | HTMLCanvasElement | null>(null);
  const cropCoordsRef = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);
  const processedFallbackUriRef = useRef<string | null>(null);

  const [ocrPicture, setOcrPicture] = useState<MonkPicture | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [hasFallbackImageData, setHasFallbackImageData] = useState(false);
  const [fallbackOcrFailed, setFallbackOcrFailed] = useState(false);

  const isFallbackReady = retryCount >= maxOcrRetries || isTimedOut;
  const isPortrait = previewDimensions ? previewDimensions.height > previewDimensions.width : false;
  const cropRegion = getCropRegion(isPortrait);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // Reset fallback counters when the active sight changes.
  useEffect(() => {
    reset();
    setRetryCount(0);
    setIsTimedOut(false);
    processedFallbackUriRef.current = null;
    setHasFallbackImageData(false);
    setFallbackOcrFailed(false);
  }, [sightId]);

  // Also reset when the overlay becomes inactive (non-OCR sight selected).
  useEffect(() => {
    if (!isActive) {
      reset();
      setRetryCount(0);
      setIsTimedOut(false);
      processedFallbackUriRef.current = null;
      setHasFallbackImageData(false);
      setFallbackOcrFailed(false);
    }
  }, [isActive]);

  // Timeout: if OCR hasn't confirmed within ocrTimeoutMs, unlock the shutter.
  useEffect(() => {
    if (!isActive || isFallbackReady || confirmedText !== null) {
      return undefined;
    }
    const timer = setTimeout(() => setIsTimedOut(true), ocrTimeoutMs);
    return () => clearTimeout(timer);
  }, [isActive, isFallbackReady, confirmedText, ocrTimeoutMs]);

  // Notify parent once limits are reached.
  useEffect(() => {
    if (isFallbackReady) {
      onFallbackReady?.();
    }
  }, [isFallbackReady, onFallbackReady]);

  // When a fallback picture arrives: show the confirm modal immediately, then run OCR in background.
  useEffect(() => {
    if (!fallbackPicture || !isFallbackReady) {
      return;
    }
    if (processedFallbackUriRef.current === fallbackPicture.uri) {
      return;
    }
    processedFallbackUriRef.current = fallbackPicture.uri;
    setFallbackOcrFailed(false);

    // Crop the picture to the frame box region, build a MonkPicture from it, then show the modal.
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
      const mimetype = 'image/jpeg';
      const applyBlob = (blob: Blob) => {
        if (cancelled) {
          return;
        }
        const uri = URL.createObjectURL(blob);
        setOcrPicture({ blob, uri, mimetype, width: sw, height: sh });
        if (config.allowManualInput) {
          setIsEditing(true);
          setEditText('');
        }
      };
      if (cropCanvas instanceof HTMLCanvasElement) {
        cropCanvas.toBlob(
          (blob) => {
            if (blob) {
              applyBlob(blob);
            }
          },
          mimetype,
          0.92,
        );
      } else {
        cropCanvas
          .convertToBlob({ type: mimetype, quality: 0.92 })
          .then(applyBlob)
          .catch(() => {});
      }

      // Clear any in-flight live-OCR state before starting fallback OCR.
      reset();
      // Signal the interval to start feeding the crop canvas to OCR.
      setHasFallbackImageData(true);
    };
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallbackPicture, isFallbackReady, config.allowManualInput]);

  // Stop the fallback OCR interval once text is confirmed.
  useEffect(() => {
    if (isFallbackReady && confirmedText !== null) {
      setHasFallbackImageData(false);
    }
  }, [isFallbackReady, confirmedText]);

  // If OCR can't confirm within 8 seconds on the fallback image, declare failure.
  useEffect(() => {
    if (!hasFallbackImageData || confirmedText !== null) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setFallbackOcrFailed(true);
      setHasFallbackImageData(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [hasFallbackImageData, confirmedText]);

  // In allowManualInput fallback mode, auto-populate editText when OCR confirms.
  useEffect(() => {
    if (isFallbackReady && isEditing && confirmedText && !editText) {
      if (mode === 'odometer') {
        const { value } = parseOdometerText(confirmedText);
        setEditText(value !== null ? String(value) : '');
      } else {
        setEditText(confirmedText);
      }
    }
  }, [isFallbackReady, isEditing, confirmedText, editText, mode]);

  // In normal (non-fallback) mode, clear editing state when OCR resets.
  useEffect(() => {
    if (!confirmedText && !isFallbackReady) {
      setIsEditing(false);
      setEditText('');
    }
  }, [confirmedText, isFallbackReady]);

  // In normal (non-fallback) mode, create the ocrPicture blob from the crop canvas.
  useEffect(() => {
    if (!confirmedText || !cropCanvasRef.current || isFallbackReady) {
      return;
    }
    const canvas = cropCanvasRef.current;
    const { width, height } = canvas;
    const mimetype = 'image/jpeg';

    const applyBlob = (blob: Blob) => {
      const uri = URL.createObjectURL(blob);
      setOcrPicture({ blob, uri, mimetype, width, height });
    };

    if (canvas instanceof HTMLCanvasElement) {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            applyBlob(blob);
          }
        },
        mimetype,
        0.92,
      );
    } else {
      canvas
        .convertToBlob({ type: mimetype, quality: 0.92 })
        .then(applyBlob)
        .catch(() => setOcrPicture(null));
    }
  }, [confirmedText, isFallbackReady]);

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

        if (!cropCoordsRef.current || srcCanvasRef.current?.width !== full.width) {
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

  const overlayStyle = getOverlayStyle(previewDimensions);

  if (!isActive) {
    return null;
  }

  const isConfirmed = confirmedText !== null;
  // In fallback mode the modal shows as soon as ocrPicture is set (even before OCR confirms).
  const showModal = ocrPicture !== null && (isConfirmed || isFallbackReady);

  const handleConfirm = () => {
    if (ocrPicture) {
      onConfirm?.(isEditing ? editText : confirmedText ?? '', ocrPicture, mode, defaultMileageUnit);
    }
  };

  const handleReject = () => {
    const newCount = retryCount + 1;
    setRetryCount(newCount);
    const nowFallback = newCount >= maxOcrRetries || isTimedOut;

    if (!nowFallback) {
      // Not at limit yet — reset and let OCR re-scan.
      setOcrPicture(null);
      reset();
      onReject?.();
    } else if (config.allowManualInput) {
      // Last chance: offer edit mode so the user can correct the reading.
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
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditText('');
    setOcrPicture(null);
    reset();
    onReject?.();
  };

  const handleInvalidReading = () => {
    setOcrPicture(null);
    reset();
    onReject?.();
  };

  const handleOcrFailed = () => {
    if (ocrPicture) {
      onConfirm?.('', ocrPicture, mode, defaultMileageUnit);
    }
    setFallbackOcrFailed(false);
    setIsEditing(false);
    setEditText('');
    setOcrPicture(null);
    reset();
  };

  const isOdometer = mode === 'odometer';
  const isOcrLoading = hasFallbackImageData && confirmedText === null;

  // Modal shows the number only for odometer (unit is sent to the API separately).
  let modalText = confirmedText ?? '';
  let isInvalidReading = false;
  if (isConfirmed && confirmedText) {
    if (isOdometer) {
      const { value } = parseOdometerText(confirmedText);
      if (value !== null) {
        modalText = value.toLocaleString('fr-FR');
      } else {
        isInvalidReading = true;
      }
    } else {
      modalText = confirmedText;
    }
  }
  const fillFraction = isFallbackReady ? 0 : isConfirmed ? 1 : consistencyCount / appearanceCount;
  const containerW = previewDimensions?.width ?? 0;
  const containerH = previewDimensions?.height ?? 0;
  const boxW = containerW * cropRegion.w;
  const boxH = containerH * cropRegion.h;
  const perimeter = getPerimeter(boxW, boxH);
  const filledLength = fillFraction * perimeter;

  const rectProps = {
    x: STROKE / 2,
    y: STROKE / 2,
    width: boxW - STROKE,
    height: boxH - STROKE,
    rx: RADIUS,
    fill: 'none',
  };

  const statusText = (() => {
    if (isConfirmed) {
      return '✓ VIN confirmed';
    }
    if (consistencyCount > 0) {
      return `${consistencyCount} / ${appearanceCount} consistent reads`;
    }
    return 'Scanning…';
  })();

  return (
    <>
      {showModal && (
        <OcrConfirmModal
          text={modalText}
          imageUri={ocrPicture?.uri ?? ''}
          onConfirm={handleConfirm}
          onReject={handleReject}
          isEditing={isEditing}
          editValue={editText}
          onEditChange={setEditText}
          onEditCancel={handleEditCancel}
          mode={mode}
          isOcrLoading={isOcrLoading}
          ocrFailed={fallbackOcrFailed}
          onOcrFailed={handleOcrFailed}
          isInvalidReading={isInvalidReading}
          onInvalidReading={handleInvalidReading}
        />
      )}
      <div style={overlayStyle}>
        {isFallbackReady && !ocrPicture && (
          <div style={styles.shutterHint(cropRegion)}>Use the shutter button to take a picture</div>
        )}
        <div style={styles.cropBox(cropRegion)}>
          <svg
            viewBox={`0 0 ${boxW} ${boxH}`}
            style={styles.svg}
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect {...rectProps} stroke='#ffffff' strokeWidth={STROKE} opacity={0.2} />
            <rect
              {...rectProps}
              stroke={COLOR_IDLE}
              strokeWidth={STROKE}
              strokeDasharray='8 6'
              opacity={consistencyCount > 0 || isConfirmed ? 0 : 0.6}
              style={{ transition: 'opacity 0.3s ease' }}
            />
            <rect
              {...rectProps}
              stroke={COLOR_CONFIRMED}
              strokeWidth={STROKE}
              strokeDasharray={`${filledLength} ${perimeter}`}
              strokeLinecap='round'
              style={{ transition: 'stroke-dasharray 0.4s ease' }}
            />
          </svg>
        </div>
      </div>
    </>
  );
}
