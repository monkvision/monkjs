import { useCallback, useState } from 'react';
import { CameraConfig } from '../Camera.types';
import { useObjectTranslation } from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import { CompressionOptions, useCompression } from './useCompression';
import { useBlurDetection } from './useBlurDetection';
import { CapturedPicture } from '../Camera.types';

export interface UseTakePictureParams {
  videoRef: React.RefObject<HTMLVideoElement>;
  config: CameraConfig;
  compressionOptions?: CompressionOptions;
  /** Laplacian variance threshold below which capture is blocked. Default: 80. Set to 0 to disable. */
  blurThreshold?: number;
}

export interface UseTakePictureResult {
  takePicture: () => Promise<CapturedPicture | null>;
  isLoading: boolean;
  /** True when the current frame is too blurry to capture */
  isBlurry: boolean;
}

export function useTakePicture({
  videoRef,
  config,
  compressionOptions,
  blurThreshold = 80,
}: UseTakePictureParams): UseTakePictureResult {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useMonitoring();
  const { compress } = useCompression(compressionOptions);
  const { tObj } = useObjectTranslation();
  const { isBlurry, checkFrame } = useBlurDetection({ threshold: blurThreshold });

  const takePicture = useCallback(async (): Promise<CapturedPicture | null> => {
    if (!videoRef.current) return null;

    // Blur gate — block capture if frame is not sharp enough
    if (blurThreshold > 0) {
      const isSharp = checkFrame(videoRef.current);
      if (!isSharp) {
        return null;
      }
    }

    setIsLoading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(videoRef.current, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, config.format ?? 'image/jpeg', 1.0),
      );
      if (!blob) return null;
      const picture = await compress(blob);
      return picture;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [videoRef, config, compress, checkFrame, blurThreshold, handleError]);

  return { takePicture, isLoading, isBlurry };
}
