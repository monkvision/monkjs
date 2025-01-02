import { PixelDimensions } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { getAspectRatio } from '@monkvision/common';
import { styles } from './CloseUpShot.styles';
import { useCloseUpShotStyle } from './hooks';
import { Counter } from '../Counter';
import { CancelButton } from '../CancelButton';
import { CaptureMode } from '../../types';

/**
 * Props of the CloseUpShot component.
 */
export interface CloseUpShotProps {
  /**
   * Callback called when the user cancels the Add Damage mode.
   */
  onCancel?: () => void;
  /**
   * Boolean indicating whether the counter should be displayed.
   *
   * @default true
   */
  showCounter?: boolean;
  /**
   * The dimensions of the Camera video stream.
   */
  streamDimensions?: PixelDimensions | null;
}

/**
 * Component implementing an HUD displayed on top of the Camera preview during the PhotoCapture process when the current
 * mode is ADD_DAMAGE_2ND_SHOT | ADD_DAMAGE_PART_SELECT_SHOT.
 */
export function CloseUpShot({ onCancel, showCounter = true, streamDimensions }: CloseUpShotProps) {
  const { t } = useTranslation();
  const style = useCloseUpShotStyle();

  const aspectRatio = getAspectRatio(streamDimensions);

  return (
    <div style={styles['container']}>
      <div style={{ ...styles['frameContainer'], aspectRatio }} data-testid='frame-container'>
        <div style={style.frame} />
      </div>
      <div style={style.top}>
        {showCounter && <Counter mode={CaptureMode.ADD_DAMAGE_2ND_SHOT} />}
        <CancelButton onCancel={onCancel} />
      </div>
      <div style={style.infoCloseup} data-testid='label'>
        {t('photo.hud.addDamage.infoCloseup')}
      </div>
    </div>
  );
}
