import { RefObject, useEffect, useRef } from 'react';
import { MediaStreamDimensions } from './useUserMedia';

/**
 * Object used to configure the camera canvas.
 */
export interface CameraCanvasConfig {
  /**
   * The dimensions of the video stream.
   */
  dimensions: MediaStreamDimensions | null;
}

/**
 * Handle used to manage the camera canvas.
 */
export interface CameraCanvasHandle {
  /**
   * The ref to the canvas element. Forward this ref to the <canvas> tag to set it up.
   */
  ref: RefObject<HTMLCanvasElement>;
}

/**
 * Custom hook used to manage the camera <canvas> element used to take video screenshots and encode images.
 */
export function useCameraCanvas({ dimensions }: CameraCanvasConfig): CameraCanvasHandle {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (dimensions && ref.current) {
      ref.current.width = dimensions.width;
      ref.current.height = dimensions.height;
    }
  }, [dimensions]);

  return { ref };
}
