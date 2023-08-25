import { RefObject, useCallback, useEffect, useRef } from 'react';
import { MediaStreamDimensions } from './useUserMedia';

/**
 * Configuration parameters for the `useCameraScreenshot` hook.
 */
export interface CameraScreenshotConfig {
  /**
   * The ref to the video element to take screenshots of.
   */
  videoRef: RefObject<HTMLVideoElement>;
  /**
   * The dimensions of the screenshot.
   */
  dimensions: MediaStreamDimensions | null;
}

/**
 * Interface describing a handle that can be used to take a screenshot of a video element.
 */
export interface CameraScreenshotHandles {
  /**
   * The ref to the canvas element. Pass this ref to a canvas element on your web page in order to use this canvas as a
   * support for drawing and generating the screenshot.
   */
  canvasRef: RefObject<HTMLCanvasElement>;
  /**
   * Callback used to take a screenshot.
   *
   * @return A ImageData object that contains the raw pixel's data.
   */
  takeScreenshot: () => ImageData;
}

/**
 * Custom hook used to take screenshots of a video element. This hook is aimed to be used in pair with a `<canvas>`
 * element referenced by the returned ref.
 *
 * @param videoRef The ref to the video element to take screenshots of.
 * @param dimensions The dimensions of the screenshot.
 * @return A handle used to take the screenshots.
 */
export function useCameraScreenshot({
  videoRef,
  dimensions,
}: CameraScreenshotConfig): CameraScreenshotHandles {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (dimensions && canvasRef.current) {
      canvasRef.current.width = dimensions.width;
      canvasRef.current.height = dimensions.height;
    }
  }, [dimensions]);

  const takeScreenshot = useCallback(() => {
    if (!canvasRef.current) {
      throw new Error('Unable to take a picture because the canvas element is null.');
    }
    const context = canvasRef.current.getContext('2d', {
      alpha: false,
      willReadFrequently: true,
    });
    if (!context) {
      throw new Error('Unable to take a picture because the canvas context is null.');
    }
    if (!dimensions) {
      throw new Error('Unable to take a picture because the video stream has no dimension.');
    }
    if (!videoRef.current) {
      throw new Error('Unable to take a picture because the video element is null.');
    }
    context.drawImage(videoRef.current, 0, 0, dimensions.width, dimensions.height);
    return context.getImageData(0, 0, dimensions.width, dimensions.height);
  }, [dimensions]);

  return {
    canvasRef,
    takeScreenshot,
  };
}
