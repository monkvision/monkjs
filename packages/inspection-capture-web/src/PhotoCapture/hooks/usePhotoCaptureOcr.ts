import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MonkApiConfig } from '@monkvision/network';
import { MileageUnit, MonkPicture, OcrMode, OcrSightConfig } from '@monkvision/types';
import { usePhotoCaptureOcrConfirm } from './usePhotoCaptureOcrConfirm';

export interface UsePhotoCaptureOcrParams {
  /** ID of the inspection OCR results will be stored against. */
  inspectionId: string;
  /** API configuration (auth token, base URL, etc.). */
  apiConfig: MonkApiConfig;
  /** ID of the currently selected sight — resets OCR fallback state when it changes. */
  selectedSightId: string;
  /** Maps sight IDs to their OCR mode; determines whether the current sight has OCR enabled. */
  ocrSights?: OcrSightConfig[];
  /** Base picture-taken handler; called for non-OCR sights and after OCR confirms. */
  basePictureTaken: (picture: MonkPicture) => void;
}

export interface UsePhotoCaptureOcrHandle {
  /** Whether the OCR timeout/retry limit has been reached and the user can take a picture manually. */
  isOcrFallbackReady: boolean;
  /** The manual picture the user took after OCR reached its fallback limit. */
  ocrFallbackPicture: MonkPicture | null;
  /** Signals that the OCR fallback threshold has been reached; pass to the HUD overlay's onFallbackReady. */
  onOcrFallbackReady: () => void;
  /** Resets OCR fallback state; call when the user returns from the gallery. */
  resetOcrFallback: () => void;
  /**
   * Routes a picture taken by the user: in fallback mode on an OCR sight it stores the picture for
   * OCR processing; otherwise it forwards directly to basePictureTaken.
   */
  handlePictureTaken: (picture: MonkPicture) => void;
  /** Calls basePictureTaken with the crop picture, sends the confirmed text to the API, then resets fallback state. */
  handleOcrConfirm: (
    text: string,
    cropPicture: MonkPicture,
    mode: OcrMode | undefined,
    defaultMileageUnit: MileageUnit | undefined,
  ) => void;
}

/**
 * Manages OCR fallback state for PhotoCapture: tracks whether the shutter is unlocked for a manual
 * picture, routes pictures to either OCR processing or the base handler, and sends confirmed OCR
 * readings to the API.
 */
export function usePhotoCaptureOcr({
  inspectionId,
  apiConfig,
  selectedSightId,
  ocrSights,
  basePictureTaken,
}: UsePhotoCaptureOcrParams): UsePhotoCaptureOcrHandle {
  const [isOcrFallbackReady, setIsOcrFallbackReady] = useState(false);
  const [ocrFallbackPicture, setOcrFallbackPicture] = useState<MonkPicture | null>(null);

  const isOcrSight = useMemo(
    () => ocrSights?.some((s) => s.sightId === selectedSightId) ?? false,
    [ocrSights, selectedSightId],
  );

  const handlePictureTaken = useCallback(
    (picture: MonkPicture) => {
      if (isOcrFallbackReady && isOcrSight) {
        setOcrFallbackPicture(picture);
      } else {
        basePictureTaken(picture);
      }
    },
    [isOcrFallbackReady, isOcrSight, basePictureTaken],
  );

  const prevSightIdRef = useRef(selectedSightId);
  useEffect(() => {
    if (selectedSightId === prevSightIdRef.current) {
      return;
    }
    prevSightIdRef.current = selectedSightId;
    setIsOcrFallbackReady(false);
    setOcrFallbackPicture(null);
  }, [selectedSightId]);

  const { handleOcrConfirm: handleOcrVehicleUpdate } = usePhotoCaptureOcrConfirm({
    inspectionId,
    apiConfig,
  });

  const handleOcrConfirm = useCallback(
    (
      text: string,
      cropPicture: MonkPicture,
      mode: OcrMode | undefined,
      defaultMileageUnit: MileageUnit | undefined,
    ) => {
      basePictureTaken(cropPicture);
      if (text) {
        handleOcrVehicleUpdate(text, mode, defaultMileageUnit);
      }
      setOcrFallbackPicture(null);
      setIsOcrFallbackReady(false);
    },
    [basePictureTaken, handleOcrVehicleUpdate],
  );

  const onOcrFallbackReady = useCallback(() => setIsOcrFallbackReady(true), []);
  const resetOcrFallback = useCallback(() => {
    setIsOcrFallbackReady(false);
    setOcrFallbackPicture(null);
  }, []);

  return {
    isOcrFallbackReady,
    ocrFallbackPicture,
    onOcrFallbackReady,
    resetOcrFallback,
    handlePictureTaken,
    handleOcrConfirm,
  };
}
