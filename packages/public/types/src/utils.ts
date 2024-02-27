/**
 * Object representing a rectangle dimensions in pixels.
 */
export interface PixelDimensions {
  /**
   * The width of the rectangle in pixels.
   */
  width: number;
  /**
   * The height of the rectangle in pixels.
   */
  height: number;
}

export interface PromiseHandlers<T> {
  onResolve: (res: T) => void;
  onReject: (err: any) => void;
  onComplete: () => void;
}
