import { MonkPicture } from '@monkvision/camera-web';
import { Icon, TakePictureButton } from '@monkvision/common-ui-web';
import { useInteractiveStatus } from '@monkvision/common';
import { useCaptureHUDButtonsStyles } from './hooks';

export interface PhotoCaptureHUDButtonsProps {
  galleryPreview?: MonkPicture;
  onTakePicture?: () => void;
  onOpenGallery?: () => void;
  onClose?: () => void;
  galleryDisabled?: boolean;
  takePictureDisabled?: boolean;
  closeDisabled?: boolean;
}

export function PhotoCaptureHUDButtons({
  galleryPreview,
  onTakePicture = () => {},
  onOpenGallery = () => {},
  onClose = () => {},
  galleryDisabled = false,
  takePictureDisabled = false,
  closeDisabled = false,
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
    galleryPreviewUrl: galleryPreview?.uri,
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
