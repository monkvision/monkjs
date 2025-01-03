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
 * Object containing the current 3D rotation of a device on the 3 main rotation axis.
 */
export interface DeviceRotation {
  /**
   * The device orientation around the Z axis (yaw).
   */
  alpha: number;
  /**
   * The device orientation around the X axis (pitch).
   */
  beta: number;
  /**
   * The device orientation around the Y axis (roll).
   */
  gamma: number;
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
