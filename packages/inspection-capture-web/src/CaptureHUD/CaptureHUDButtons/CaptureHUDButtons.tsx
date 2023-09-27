import { MonkPicture } from '@monkvision/camera-web';
import {
  Icon,
  TakePictureButton,
  InteractiveColor,
  useInteractiveColor,
} from '@monkvision/common-ui-web';
import { suffix } from '@monkvision/common';
import './CaptureHUDButtons.css';

const captureBtnColors: InteractiveColor = {
  regular: '#f3f3f3',
  hover: '#e3e3e3',
  active: '#cbcbcb',
  disabled: '#b6b6b6be',
};

export interface CaptureHUDButtonsProps {
  galleryPreview?: MonkPicture;
  onTakePicture?: () => void;
  onOpenGallery?: () => void;
  onClose?: () => void;
  galleryDisabled?: boolean;
  takePictureDisabled?: boolean;
  closeDisabled?: boolean;
}

export function CaptureHUDButtons({
  galleryPreview,
  onTakePicture = () => {},
  onOpenGallery = () => {},
  onClose = () => {},
  galleryDisabled = false,
  takePictureDisabled = false,
  closeDisabled = false,
}: CaptureHUDButtonsProps) {
  const { color: galleryColor, events: galleryEvents } = useInteractiveColor(
    captureBtnColors,
    galleryDisabled,
  );
  const { color: closeColor, events: closeEvents } = useInteractiveColor(
    captureBtnColors,
    galleryDisabled,
  );

  return (
    <div className='mnk-capture-hud-buttons-container'>
      <button
        data-testid='monk-gallery-btn'
        className={suffix('mnk-capture-hud-button', { disabled: galleryDisabled })}
        disabled={galleryDisabled}
        onClick={onOpenGallery}
        {...galleryEvents}
      >
        {galleryPreview ? (
          <div
            className='mnk-background-cover'
            style={{ backgroundImage: `url(${galleryPreview.uri})` }}
          ></div>
        ) : (
          <Icon icon='image' size={30} primaryColor={galleryColor} />
        )}
      </button>
      <TakePictureButton onClick={onTakePicture} size={85} disabled={takePictureDisabled} />
      <button
        data-testid='monk-close-btn'
        className={suffix('mnk-capture-hud-button', { disabled: closeDisabled })}
        disabled={closeDisabled}
        onClick={onClose}
        {...closeEvents}
      >
        <Icon icon='close' size={30} primaryColor={closeColor} />
      </button>
    </div>
  );
}
