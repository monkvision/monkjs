import { useEffect, useRef } from 'react';
import { CameraHandle } from '@monkvision/camera-web';
import { UseOcrConfig, UseOcrResult, useOcr, OCR_STABILIZER_CONFIG } from '@monkvision/ml-web';

export interface PhotoCaptureOcrConfig extends UseOcrConfig {
  /**
   * How often (in ms) to grab a frame from the camera and feed it to the OCR pipeline.
   * @default 600
   */
  captureIntervalMs?: number;
  /**
   * When set, OCR is only active while this sight ID is selected.
   * On other sights the overlay is hidden and no frames are processed.
   */
  activeSightId?: string;
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
    if (!isReady) return;
    const interval = setInterval(() => {
      if (!handleRef.current || handleRef.current.isLoading) return;
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
