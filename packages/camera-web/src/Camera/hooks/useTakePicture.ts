import { useCallback, useState } from 'react';
import { useMonitoring } from '@monkvision/monitoring';
import { useBlurDetection } from './useBlurDetection';
import { CameraConfig } from '../../Camera.types';

export interface UseTakePictureParams {
  config: CameraConfig;
  handle: {
    takeScreenshot: () => string | null;
    videoRef: React.RefObject<HTMLVideoElement>;
  };
  onPictureTaken?: (picture: CompressedImage) => void;
  blurThreshold?: number;
}

export interface CompressedImage {
  blob: Blob;
  uri: string;
  width: number;
  height: number;
  mimetype: string;
  size: number;
}

export interface UseTakePictureResult {
  takePicture: () => Promise<void>;
  isLoading: boolean;
  isBlurry: boolean;
}

async function compressImage(
  dataUri: string,
  quality: number,
  format: string,
): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob returned null'));
            return;
          }
          const uri = URL.createObjectURL(blob);
          resolve({
            blob,
            uri,
            width: img.naturalWidth,
            height: img.naturalHeight,
            mimetype: format,
            size: blob.size,
          });
        },
        format,
        quality,
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = dataUri;
  });
}

/**
 * Hook that handles the picture taking flow with an integrated blur gate.
 *
 * Before saving a captured frame, it runs a Laplacian variance check on the
 * current video frame. If the frame is below the blur threshold, the capture
 * is blocked and `isBlurry` is set to true so the HUD can show feedback.
 *
 * The blur gate is best-effort: on any error it fails open (allows capture)
 * so it never silently blocks the user on unsupported environments.
 */
export function useTakePicture({
  config,
  handle,
  onPictureTaken,
  blurThreshold,
}: UseTakePictureParams): UseTakePictureResult {
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useMonitoring();
  const { isBlurry, checkFrame, reset } = useBlurDetection({ threshold: blurThreshold });

  const takePicture = useCallback(async () => {
    if (isLoading) return;

    // ── Blur gate ──────────────────────────────────────────────────────────
    // Check the current video frame before firing the shutter.
    // If blurry, update isBlurry state for the HUD and bail out.
    const videoEl = handle.videoRef?.current;
    if (videoEl) {
      const isSharp = checkFrame(videoEl);
      if (!isSharp) {
        // isBlurry is already set to true inside checkFrame — HUD will react
        return;
      }
    }
    // ───────────────────────────────────────────────────────────────────────

    setIsLoading(true);
    try {
      const screenshot = handle.takeScreenshot();
      if (!screenshot) {
        throw new Error('takeScreenshot returned null');
      }

      const format = config.pictureFormat ?? 'image/jpeg';
      const quality = config.quality ?? 0.8;
      const picture = await compressImage(screenshot, quality, format);

      reset();
      onPictureTaken?.(picture);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, handle, config, onPictureTaken, checkFrame, reset, handleError]);

  return { takePicture, isLoading, isBlurry };
}
