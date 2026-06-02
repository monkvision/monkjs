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
 * The current state of coverage tracking in the VehicleWalkaroundIndicator.
 * - `'off'`: No tracking. Covered segments are cleared.
 * - `'active'`: Tracking is ongoing. Covered segments are updated as the position changes.
 * - `'paused'`: Tracking is paused. Covered segments are retained but not updated.
 */
export enum WalkaroundTrackingState {
  Off = 'off',
  Active = 'active',
  Paused = 'paused',
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
   * Pre-computed covered segments to render as green arcs on the walkaround circle.
   * Each segment describes a covered arc as a start and end angle in degrees (0-360).
   *
   * For self-contained tracking, use the exported `useVehicleWalkaroundIndicatorState` hook
   * and pass its `coveredSegments` result.
   */
  coveredSegments?: CoveredSegment[];
  /**
   * When true, transitions the car icon to a green checkmark to signal the walkaround is complete.
   */
  showCompletionIcon?: boolean;
}
