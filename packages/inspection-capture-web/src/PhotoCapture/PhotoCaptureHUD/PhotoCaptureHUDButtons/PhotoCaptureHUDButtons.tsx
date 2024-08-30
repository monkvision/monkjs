import { Icon, TakePictureButton } from '@monkvision/common-ui-web';
import { useInteractiveStatus } from '@monkvision/common';
import { useCaptureHUDButtonsStyles } from './hooks';
import { PhotoCaptureHUDButtonsProps } from './PhotoCaptureHUDButtons.model';

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
    actionDisabled,
    actionBtnAvailable: !!onAction,
    galleryPreview,
    showActionButton,
    action,
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
