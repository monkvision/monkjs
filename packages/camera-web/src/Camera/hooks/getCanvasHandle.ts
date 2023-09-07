import { RefObject } from 'react';

/**
 * A handle used to manipulate a canvas element.
 */
export interface CanvasHandle {
  /**
   * The HTML canvas element.
   */
  canvas: HTMLCanvasElement;
  /**
   * A 2D context created to draw on the canvas.
   */
  context: CanvasRenderingContext2D;
}

/**
 * Utility function used to retreive a canvas handle or throw if it is not available.
 */
export function getCanvasHandle(ref: RefObject<HTMLCanvasElement>): CanvasHandle {
  if (!ref.current) {
    throw new Error('Unable to process the camera picture because the canvas element is null.');
  }
  const context = ref.current.getContext('2d', {
    alpha: false,
    willReadFrequently: true,
  });
  if (!context) {
    throw new Error('Unable to process the camera picture because the canvas context is null.');
  }
  return { canvas: ref.current, context };
}
