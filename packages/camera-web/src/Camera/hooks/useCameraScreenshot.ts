import { RefObject, useCallback } from 'react';
import { getCanvasHandle } from './getCanvasHandle';
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
   * The ref to the canvas element used to draw the screenshots
   */
  canvasRef: RefObject<HTMLCanvasElement>;
  /**
   * The dimensions of the screenshot.
   */
  dimensions: MediaStreamDimensions | null;
}

/**
 * Interface describing a handle that can be used to take a screenshot of a video element.
 */
export interface CameraScreenshotHandle {
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
 */
export function useCameraScreenshot({
  videoRef,
  canvasRef,
  dimensions,
}: CameraScreenshotConfig): CameraScreenshotHandle {
  const takeScreenshot = useCallback(() => {
    const { context } = getCanvasHandle(canvasRef);
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
