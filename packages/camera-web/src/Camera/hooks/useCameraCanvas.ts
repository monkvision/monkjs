import { RefObject, useEffect, useMemo, useRef } from 'react';
import { CameraResolution, PixelDimensions } from '@monkvision/types';
import { getResolutionDimensions } from './utils';

/**
 * Object used to configure the camera canvas.
 */
export interface CameraCanvasConfig {
  /**
   * The resolution of the pictures taken asked by the user of the Camera component.
   */
  resolution: CameraResolution;
  /**
   * Boolean indicating if the Camera component should allow image upscaling when the asked resolution is bigger than
   * the one of the device Camera.
   */
  allowImageUpscaling: boolean;
  /**
   * The dimensions of the video stream.
   */
  streamDimensions: PixelDimensions | null;
}

/**
 * Handle used to manage the camera canvas.
 */
export interface CameraCanvasHandle {
  /**
   * The ref to the canvas element. Forward this ref to the <canvas> tag to set it up.
   */
  ref: RefObject<HTMLCanvasElement>;
  /**
   * The dimensions of the canvas.
   */
  dimensions: PixelDimensions | null;
}

/**
 * This function is used to calculate the dimensions of the canvas that will be used to draw the image, thus also
 * calculating the output dimensions of the image itself, respecting the following logic :
 * - If the aspect ratio of the stream and constraints are the same, we simply scale the stream to make it fit the
 * constraints. Note that if `allowImageUpscaling` is `false`, and the stream is smaller than the constraints, we don't
 * scale "up" the stream image, and we simply return the stream dimensions.
 * - If the aspect ratio of the stream is different from the one specified in the constraints, the logic is the same,
 * but the output aspect ratio will be the same one as the stream. The stream dimensions will simply be scaled
 * following the same logic as the previous point, making sure that neither the width nor the height of the canvas will
 * exceed the ones described by the constraints.
 */
function getCanvasDimensions({
  resolution,
  streamDimensions,
  allowImageUpscaling,
}: CameraCanvasConfig): PixelDimensions | null {
  if (!streamDimensions) {
    return null;
  }
  const isPortrait = streamDimensions.width < streamDimensions.height;
  const constraintsDimensions = getResolutionDimensions(resolution, isPortrait);
  const streamRatio = streamDimensions.width / streamDimensions.height;

  if (
    constraintsDimensions.width > streamDimensions.width &&
    constraintsDimensions.height > streamDimensions.height &&
    !allowImageUpscaling
  ) {
    return {
      width: streamDimensions.width,
      height: streamDimensions.height,
    };
  }
  const fitToHeight = constraintsDimensions.width / streamRatio > constraintsDimensions.height;
  return {
    width: fitToHeight ? constraintsDimensions.height * streamRatio : constraintsDimensions.width,
    height: fitToHeight ? constraintsDimensions.height : constraintsDimensions.width / streamRatio,
  };
}

/**
 * Custom hook used to manage the camera <canvas> element used to take video screenshots and encode images.
 */
export function useCameraCanvas({
  resolution,
  streamDimensions,
  allowImageUpscaling,
}: CameraCanvasConfig): CameraCanvasHandle {
  const ref = useRef<HTMLCanvasElement>(null);
  const handle = useMemo(
    () => ({
      ref,
      dimensions: getCanvasDimensions({ resolution, streamDimensions, allowImageUpscaling }),
    }),
    [resolution, streamDimensions],
  );

  useEffect(() => {
    if (handle.dimensions && ref.current) {
      ref.current.width = handle.dimensions.width;
      ref.current.height = handle.dimensions.height;
    }
  }, [handle.dimensions]);

  return handle;
}
