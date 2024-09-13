import { Icon, TakePictureButton } from '@monkvision/common-ui-web';
import { useInteractiveStatus } from '@monkvision/common';
import { useCaptureHUDButtonsStyles } from './hooks';
import { PhotoCaptureHUDButtonsProps } from './PhotoCaptureHUDButtons.model';

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
  showGalleryBadge = false,
  retakeCount = 0,
  action = 'close',
}: PhotoCaptureHUDButtonsProps) {
  const { status: galleryStatus, eventHandlers: galleryEventHandlers } = useInteractiveStatus({
    disabled: galleryDisabled,
  });
  const { status: closeStatus, eventHandlers: closeEventHandlers } = useInteractiveStatus({
    disabled: closeDisabled,
  });
  const { containerStyle, gallery, galleryBadgeStyle, close, backgroundCoverStyle } =
    useCaptureHUDButtonsStyles({
      galleryStatus,
      closeStatus,
      closeBtnAvailable: !!onClose,
      galleryPreview,
      showCloseButton,
      showGalleryBadge,
    });

  return (
    <div style={containerStyle}>
      <button
        style={close.style}
        disabled={closeDisabled}
        onClick={onClose}
        {...closeEventHandlers}
        data-testid='monk-close-btn'
      >
        <Icon icon={action} size={30} primaryColor={close.iconColor} />
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
