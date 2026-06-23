import { useCallback, useState } from 'react';
import { CompressionOptions, ImageCompression } from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { CameraConfig } from '../Camera.types';
import { useBlurDetection } from './useBlurDetection';

export interface UseTakePictureParams {
  videoRef: React.RefObject<HTMLVideoElement>;
  config: CameraConfig;
  compressionOptions?: CompressionOptions;
  /** Laplacian variance threshold below which a frame is considered blurry. Default: 80. */
  blurThreshold?: number;
}

export interface UseTakePictureResult {
  takePicture: () => Promise<void>;
  isLoading: boolean;
  /** True if the last capture attempt was blocked because the frame was too blurry. */
  isBlurry: boolean;
  lastPicture: ImageCompression | null;
}

export function useTakePicture({
  videoRef,
  config,
  compressionOptions,
  blurThreshold,
}: UseTakePictureParams): UseTakePictureResult {
  const [isLoading, setIsLoading] = useState(false);
  const [lastPicture, setLastPicture] = useState<ImageCompression | null>(null);
  const { checkFrame, isBlurry, reset } = useBlurDetection();
  const { handleError } = useMonitoring();

  const takePicture = useCallback(async () => {
    if (isLoading) return;

    const video = videoRef.current;

    // Blur gate — check sharpness before committing to capture
    const isSharp = checkFrame(video, blurThreshold);
    if (!isSharp) {
      // Frame is blurry — surface isBlurry=true to HUD and bail out
      return;
    }

    reset();
    setIsLoading(true);

    try {
      if (!video) throw new Error('Video element is not available.');

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get 2D context.');
      ctx.drawImage(video, 0, 0);

      const quality = compressionOptions?.quality ?? config.quality ?? 0.8;
      const mimeType = compressionOptions?.format ?? 'image/jpeg';
      const base64 = canvas.toDataURL(mimeType, quality);

      setLastPicture({ base64, width: canvas.width, height: canvas.height, mimeType });
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, videoRef, checkFrame, blurThreshold, reset, compressionOptions, config, handleError]);

  return { takePicture, isLoading, isBlurry, lastPicture };
}
