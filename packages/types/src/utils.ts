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

/**
 * Enumeration of the device orientations.
 */
export enum DeviceOrientation {
  /**
   * Portrait orientation (width < height).
   */
  PORTRAIT = 'portrait',
  /**
   * Landscape orientation (width > height).
   */
  LANDSCAPE = 'landscape',
}

/**
 * Enumeration of the possible sort orders.
 */
export enum SortOrder {
  /**
   * Sort in ascending order.
   */
  ASC = 'asc',
  /**
   * Sort in descending order.
   */
  DESC = 'desc',
}

/**
 * Callbacks used to handle the result of a promise
 */
export interface PromiseHandlers<T> {
  /**
   * Handler called when the promise resolves.
   */
  onResolve: (res: T) => void;
  /**
   * Handler called when the promise rejects.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReject: (err: any) => void;
  /**
   * Handler called when the promise completes.
   */
  onComplete: () => void;
}
