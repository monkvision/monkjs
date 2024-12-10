import { ButtonProps } from '@monkvision/common-ui-web';

/**
 * Props accepted by the VideoCaptureIntroLayout component.
 */
export interface VideoCaptureIntroLayoutProps {
  /**
   * Boolean indicating if a black backdrop should be displayed behind the component.
   */
  showBackdrop?: boolean;
  /**
   * Pass-through props passed down to the confirm button.
   */
  confirmButtonProps?: Partial<ButtonProps>;
}
