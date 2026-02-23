import { CameraDistance } from '@monkvision/types';

/**
 * Props accepted by the VehicleWalkaroundIndicator component.
 */
export interface VehicleWalkaroundIndicatorProps {
  /**
   * The rotation of the user around the vehicle (0-360 degrees).
   * - 0: POV in the front of the car
   * - 180: POV is behind the back of the car
   */
  alpha: number;
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
   * POV/Flashlight distance from the vehicule.
   *
   * @default CameraDistance.STANDARD
   */
  distance?: CameraDistance;
  /**
   * Boolean indicating if the progress bar should be visible (Circle and vehicle).
   */
  showProgressBar?: boolean;
}
