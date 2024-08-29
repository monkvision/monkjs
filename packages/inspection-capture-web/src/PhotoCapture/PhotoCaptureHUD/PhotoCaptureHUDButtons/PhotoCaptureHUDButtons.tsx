import { Icon, IconName, TakePictureButton } from '@monkvision/common-ui-web';
import { useInteractiveStatus } from '@monkvision/common';
import { useCaptureHUDButtonsStyles } from './hooks';

/**
 * Props of the PhotoCaptureHUDButtons component.
 */
export interface PhotoCaptureHUDButtonsProps {
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
  /**
   * Type of the action button to display. If the value is 'close', the button will display a close icon.
   *
   * @default 'close'
   */
  action?: ('close' | 'check') & IconName;
  /**
   * Boolean indicating if the action button is disabled.
   *
   * @default false
   */
  actionDisabled?: boolean;
  /**
   * Boolean indicating if the action button should be displayed in the HUD on top of the Camera preview.
   *
   * @default false
   */
  showActionButton?: boolean;
  /**
   * Callback called when the user clicks on the action button. If this callback is not provided, the action button will
   * not be displayed on the screen.
   */
  onAction?: () => void;
}

/**
 * Components implementing the main buttons of the PhotoCapture Camera HUD. This component implements 3 buttons :
 * - A take picture button
 * - A gallery button
 * - A action button (only displayed if the `onAction` callback is defined)
 */
export function PhotoCaptureHUDButtons({
  galleryPreview,
  onTakePicture,
  onOpenGallery,
  galleryDisabled = false,
  takePictureDisabled = false,
  showGalleryBadge = false,
  retakeCount = 0,
  onAction,
  actionDisabled = false,
  showActionButton = false,
  action = 'close',
}: PhotoCaptureHUDButtonsProps) {
  const { status: galleryStatus, eventHandlers: galleryEventHandlers } = useInteractiveStatus({
    disabled: galleryDisabled,
  });
  const { status: actionButtonStatus, eventHandlers: actionEventHandlers } = useInteractiveStatus({
    disabled: actionDisabled,
  });
  const {
    containerStyle,
    gallery,
    galleryBadgeStyle,
    actionButton: confirmButton,
    backgroundCoverStyle,
  } = useCaptureHUDButtonsStyles({
    galleryStatus,
    actionButtonStatus,
    actionBtnAvailable: !!onAction,
    galleryPreview,
    showActionButton,
    showGalleryBadge,
  });

  return (
    <div style={containerStyle}>
      <button
        style={confirmButton.style}
        disabled={actionDisabled}
        onClick={onAction}
        {...actionEventHandlers}
        data-testid='monk-action-btn'
      >
        <Icon icon={action} size={30} primaryColor={confirmButton.iconColor} />
      </button>
      <TakePictureButton onClick={onTakePicture} size={85} disabled={takePictureDisabled} />
      <button
        style={gallery.style}
        disabled={galleryDisabled}
        onClick={onOpenGallery}
        {...galleryEventHandlers}
        data-testid='monk-gallery-btn'
      >
        <>
          {galleryPreview ? (
            <div style={backgroundCoverStyle}></div>
          ) : (
            <Icon icon='gallery' size={30} primaryColor={gallery.iconColor} />
          )}
          <div data-testid='monk-gallery-badge' style={galleryBadgeStyle}>
            {retakeCount > 0 && retakeCount}
          </div>
        </>
      </button>
    </div>
  );
}
