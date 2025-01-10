import { ButtonProps } from '@monkvision/common-ui-web';

/**
 * Props accepted by the VideoCapturePageLayout component.
 */
export interface VideoCapturePageLayoutProps {
  /**
   * Boolean indicating if a black backdrop should be displayed behind the component.
   *
   * @default false
   */
  showBackdrop?: boolean;
  /**
   * Boolean indicating if the title of the page should be displayed or not.
   *
   * @default true
   */
  showTitle?: boolean;
  /**
   * Pass-through props passed down to the confirm button.
   */
  confirmButtonProps?: Partial<ButtonProps>;
}
