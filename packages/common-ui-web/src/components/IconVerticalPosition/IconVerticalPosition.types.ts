import { CameraHeight } from '@monkvision/types';

export enum IconVerticalPositionVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

/**
 * Props accepted by the IconVerticalPosition component.
 */
export interface IconVerticalPositionProps {
  /**
   * The size (width and height, in pixels) of the icon.
   *
   * @default 50
   */
  size?: number;
  /**
   * The height position of the icon.
   *
   * @default CameraHeight.MID
   */
  position?: CameraHeight;
  /**
   * The height position of the icon.
   *
   * @default primary
   */
  variant?: IconVerticalPositionVariant;
}
