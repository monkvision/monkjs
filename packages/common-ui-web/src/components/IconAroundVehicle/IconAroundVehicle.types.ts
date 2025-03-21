/**
 * Props accepted by the IconAroundVehicle component.
 */
export interface IconAroundVehicleProps {
  /**
   * The size (width and height, in pixels) of the icon.
   *
   * @default 50
   */
  size?: number;
  /**
   * Pov position angle to the north:
   * - 0: POV in the front of the car
   * - 180: POV is behind the back of the car
   *
   * @default 0
   */
  positionAroundVehicle?: number;
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
   * Boolean indicating if the POV should be closer to the center.
   *
   * @default false
   */
  isPovClose?: boolean;
}
