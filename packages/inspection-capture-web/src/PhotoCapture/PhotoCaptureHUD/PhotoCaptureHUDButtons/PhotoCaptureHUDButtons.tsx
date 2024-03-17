import { MonkPicture } from '@monkvision/camera-web';
import { Icon, TakePictureButton } from '@monkvision/common-ui-web';
import { useInteractiveStatus } from '@monkvision/common';
import { useCaptureHUDButtonsStyles } from './hooks';

/**
 * Props of the PhotoCaptureHUDButtons component.
 */
export interface PhotoCaptureHUDButtonsProps {
  /**
   * Picture displayed in the gallery button icon. Usually, this is the last picture taken by the user. If no picture
   * is provided, a gallery icon will be displayed instead.
   */
  galleryPreview?: MonkPicture;
  /**
   * Callback called when the user clicks on the take picture button.
   */
  onTakePicture?: () => void;
  /**
   * Callback called when the user clicks on the gallery button.
   */
  onOpenGallery?: () => void;
  /**
   * Callback called when the user clicks on the close button. If this callback is not provided, the close button will
   * not be displayed on the screen.
   */
  onClose?: () => void;
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
}

/**
 * Components implementing the main buttons of the PhotoCapture Camera HUD. This component implements 3 buttons :
 * - A take picture button
 * - A gallery button
 * - A close button (only displayed if the `onClose` callback is defined)
 */
export function PhotoCaptureHUDButtons({
  galleryPreview,
  onTakePicture,
  onOpenGallery,
  onClose,
  galleryDisabled = false,
  takePictureDisabled = false,
  closeDisabled = false,
  showCloseButton = false,
}: PhotoCaptureHUDButtonsProps) {
  const { status: galleryStatus, eventHandlers: galleryEventHandlers } = useInteractiveStatus({
    disabled: galleryDisabled,
  });
  const { status: closeStatus, eventHandlers: closeEventHandlers } = useInteractiveStatus({
    disabled: closeDisabled,
  });
  const { containerStyle, gallery, close, backgroundCoverStyle } = useCaptureHUDButtonsStyles({
    galleryStatus,
    closeStatus,
    closeBtnAvailable: !!onClose,
    galleryPreviewUrl: galleryPreview?.uri,
    showCloseButton,
  });

  return (
    <div style={containerStyle}>
      <button
        style={gallery.style}
        disabled={galleryDisabled}
        onClick={onOpenGallery}
        {...galleryEventHandlers}
        data-testid='monk-gallery-btn'
      >
        {galleryPreview ? (
          <div style={backgroundCoverStyle}></div>
        ) : (
          <Icon icon='image' size={30} primaryColor={gallery.iconColor} />
        )}
      </button>
      <TakePictureButton onClick={onTakePicture} size={85} disabled={takePictureDisabled} />
      <button
        style={close.style}
        disabled={closeDisabled}
        onClick={onClose}
        {...closeEventHandlers}
        data-testid='monk-close-btn'
      >
        <Icon icon='close' size={30} primaryColor={close.iconColor} />
      </button>
    </div>
  );
}
