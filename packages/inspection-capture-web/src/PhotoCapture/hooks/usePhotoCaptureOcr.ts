import { useEffect, useRef } from 'react';
import { CameraHandle } from '@monkvision/camera-web';
import { UseOcrConfig, UseOcrResult, useOcr, OCR_STABILIZER_CONFIG } from '@monkvision/ml-web';

/**
 * How the confirmed OCR text is interpreted and what action is taken on confirmation.
 * - `'vin'`: detected text is treated as a Vehicle Identification Number.
 * - `'odometer'`: detected text is parsed as a mileage reading (integer value + optional unit).
 */
export type OcrMode = 'vin' | 'odometer';

/**
 * Pairs a sight with the OCR mode that should be active when that sight is selected.
 */
export interface OcrSightConfig {
  /**
   * The sight ID that activates this OCR mode.
   */
  sightId: string;
  /**
   * How the confirmed OCR text is interpreted on this sight.
   * @see OcrMode
   */
  mode: OcrMode;
}

export interface PhotoCaptureOcrConfig extends UseOcrConfig {
  /**
   * How often (in ms) to grab a frame from the camera and feed it to the OCR pipeline.
   * @default 600
   */
  captureIntervalMs?: number;
  /**
   * When set, OCR overlay is only active on the matching sight and uses that sight's mode.
   * On all other sights the overlay is hidden. If omitted, OCR is always active.
   */
  activeSights?: OcrSightConfig[];
}

export interface UsePhotoCaptureOcrResult {
  ocrResult: UseOcrResult;
  /** Call this with the current CameraHandle once the camera is ready. */
  setCameraHandle: (handle: CameraHandle | null) => void;
}

export function usePhotoCaptureOcr(config: PhotoCaptureOcrConfig): UsePhotoCaptureOcrResult {
  const { captureIntervalMs = OCR_STABILIZER_CONFIG.captureIntervalMs, ...ocrConfig } = config;

  const ocrResult = useOcr(ocrConfig);
  const { isReady, processFrame, confirmedText, unloadModels } = ocrResult;

  const handleRef = useRef<CameraHandle | null>(null);
  const setCameraHandle = (handle: CameraHandle | null) => {
    handleRef.current = handle;
  };

  // Start OCR polling once models are loaded.
  useEffect(() => {
    if (!isReady) {
      return undefined;
    }
    const interval = setInterval(() => {
      if (!handleRef.current || handleRef.current.isLoading) {
        return;
      }
      try {
        const imageData = handleRef.current.getImageData();
        processFrame(imageData);
      } catch {
        // camera not ready yet — skip frame
      }
    }, captureIntervalMs);
    return () => clearInterval(interval);
  }, [isReady, captureIntervalMs, processFrame]);

  // Unload models once text is confirmed to release WASM memory.
  useEffect(() => {
    if (confirmedText !== null) {
      unloadModels();
    }
  }, [confirmedText, unloadModels]);

  return { ocrResult, setCameraHandle };
}
