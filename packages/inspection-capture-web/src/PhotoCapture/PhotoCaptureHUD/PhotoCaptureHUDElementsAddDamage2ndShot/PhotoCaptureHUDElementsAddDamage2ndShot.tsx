import { PixelDimensions } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { isMobileDevice } from '@monkvision/common';
import { PhotoCaptureMode } from '../../hooks';
import { styles } from './PhotoCaptureHUDPreviewAddDamage2ndShot.styles';
import { PhotoCaptureHUDCounter } from '../PhotoCaptureHUDCounter';
import { PhotoCaptureHUDCancelButton } from '../PhotoCaptureHUDCancelButton';
import { usePhotoCaptureHUDPreviewAddDamage2ndShotStyle } from './hooks';

/**
 * Props of the PhotoCaptureHUDPreviewAddDamage2ndShot component.
 */
export interface PhotoCaptureHUDAddDamagePreview2ndShotProps {
  /**
   * Callback called when the user cancels the Add Damage mode.
   */
  onCancel?: () => void;
  /**
   * The dimensions of the Camera video stream.
   */
  streamDimensions?: PixelDimensions | null;
}

function getAspectRatio(streamDimensions?: PixelDimensions | null) {
  if (isMobileDevice() && streamDimensions) {
    return `${streamDimensions?.width}/${streamDimensions?.height}`;
  }
  return '16/9';
}

/**
 * Component implementing an HUD displayed on top of the Camera preview during the PhotoCapture process when the current
 * mode is ADD_DAMAGE_2ND_SHOT.
 */
export function PhotoCaptureHUDPreviewAddDamage2ndShot({
  onCancel,
  streamDimensions,
}: PhotoCaptureHUDAddDamagePreview2ndShotProps) {
  const { t } = useTranslation();
  const style = usePhotoCaptureHUDPreviewAddDamage2ndShotStyle();

  const aspectRatio = getAspectRatio(streamDimensions);

  return (
    <div style={styles['container']}>
      <div style={{ ...styles['frameContainer'], aspectRatio }} data-testid='frame-container'>
        <div style={style.frame} />
      </div>
      <div style={style.top}>
        <PhotoCaptureHUDCounter mode={PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT} />
        <PhotoCaptureHUDCancelButton onCancel={onCancel} />
      </div>
      <div style={style.infoCloseup}>{t('photo.hud.addDamage.infoCloseup')}</div>
    </div>
  );
}
