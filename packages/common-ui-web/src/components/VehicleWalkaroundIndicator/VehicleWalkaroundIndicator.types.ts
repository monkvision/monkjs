import { CameraDistance } from '@monkvision/types';

/**
 * Represents a covered segment of the walkaround (in degrees).
 */
export interface CoveredSegment {
  /**
   * Start angle in degrees (0-360).
   */
  start: number;
  /**
   * End angle in degrees (0-360).
   */
  end: number;
}

/**
 * Props accepted by the VehicleWalkaroundIndicator component.
 */
export interface VehicleWalkaroundIndicatorProps {
  /**
   * The rotation of the user around the vehicle (0-360 degrees).
   * This is calculated from the device orientation alpha and the starting position.
   * - 0: POV in the front of the car
   * - 180: POV is behind the back of the car
   */
  walkaroundPosition: number;
  /**
   * The size (width and height, in pixels) of the indicator.
   *
   * @default 70
   */
  size?: number;
  /**
   * POV orientation angle:
   * - 0: POV is facing north
   * - 180: POV is facing south.
   */
  orientationAngle?: number;
  /**
   * Boolean indicating if the circle should be visible.
   *
   * @default true
   */
  showCircle?: boolean;
  /**
   * POV/Flashlight distance from the vehicle.
   *
   * @default CameraDistance.STANDARD
   */
  distance?: CameraDistance;
  /**
   * Boolean indicating if the progress bar should be visible (Circle and vehicle).
   */
  showProgressBar?: boolean;
  /**
   * Boolean indicating if segment tracking is active.
   * When true, the component will track and display covered segments.
   *
   * @default false
   */
  isTracking?: boolean;
}
