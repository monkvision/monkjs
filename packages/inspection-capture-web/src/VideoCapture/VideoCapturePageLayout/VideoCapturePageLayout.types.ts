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
   * Boolean indicating if the Monk logo should be displayed or not.
   */
  showLogo?: boolean;
  /**
   * Boolean indicating if the confirm button should be displayed or not.
   * If true, the confirmButtonProps must be provided.
   */
  showConfirmButton?: boolean;
  /**
   * Pass-through props passed down to the confirm button.
   */
  confirmButtonProps?: Partial<ButtonProps>;
}
