import { IconName } from '@monkvision/common-ui-web';

/**
 * Photo capture action button props.
 */
export interface ActionButtonProps {
  /**
   * Type of the action button to display. If the value is 'close', the button will display a close icon.
   *
   * @default 'close'
   */
  action?: 'close' & IconName;
  /**
   * Boolean indicating if the close button is disabled.
   *
   * @default false
   */
  closeDisabled?: boolean;
  /**
   * Boolean indicating if the close button should be displayed in the HUD on top of the Camera preview.
   *
   * @default false
   */
  showCloseButton?: boolean;
  /**
   * Callback called when the user clicks on the close button. If this callback is not provided, the close button will
   * not be displayed on the screen.
   */
  onClose?: () => void;
}

/**
 * Props of the PhotoCaptureHUDButtons component.
 */
export type PhotoCaptureHUDButtonsProps = ActionButtonProps & {
  /**
   * URI of the picture displayed in the gallery button icon. Usually, this is the last picture taken by the user. If no
   * picture is provided, a gallery icon will be displayed instead.
   */
  galleryPreview?: string;
  /**
   * Callback called when the user clicks on the take picture button.
   */
  onTakePicture?: () => void;
  /**
   * Callback called when the user clicks on the gallery button.
   */
  onOpenGallery?: () => void;
  /**
   * Boolean indicating if the gallery button is disabled.
   *
   * @default false
   */
  galleryDisabled?: boolean;
  /**
   * Boolean indicating if the take picture button is disabled.
   *
   * @default false
   */
  takePictureDisabled?: boolean;
  /**
   * Boolean indicating if the little notification badge on top of the gallery button should be displayed.
   *
   * @default false
   */
  showGalleryBadge?: boolean;
  /**
   * Total number of sights to retake
   *
   * @default 0
   */
  retakeCount?: number;
};
