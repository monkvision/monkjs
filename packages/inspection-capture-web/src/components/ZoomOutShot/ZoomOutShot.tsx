import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { styles } from './ZoomOutShot.styles';
import { useColorBackground } from '../../hooks';
import { CaptureMode } from '../../types';
import { crosshairSvg } from '../../assets';
import { useZoomOutShotStyles } from './hooks';
import { Counter } from '../Counter';
import { CancelButton } from '../CancelButton';

/**
 * Props of the ZoomOutShot component.
 */
export interface ZoomOutShotProps {
  /**
   * Callback called when the user cancels the Add Damage mode.
   */
  onCancel?: () => void;
}

/**
 * Component implementing an HUD displayed on top of the Camera preview during the PhotoCapture process when the current
 * mode is ADD_DAMAGE_1ST_SHOT.
 */
export function ZoomOutShot({ onCancel }: ZoomOutShotProps) {
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const { t } = useTranslation();
  const primaryColor = useColorBackground();
  const style = useZoomOutShotStyles();

  return (
    <div style={styles['container']}>
      <DynamicSVG style={styles['svg']} svg={crosshairSvg} />
      <div style={style.top}>
        <Counter mode={CaptureMode.ADD_DAMAGE_1ST_SHOT} />
        <CancelButton onCancel={onCancel} />
      </div>
      {showInfoPopup && (
        <Button
          icon='close'
          primaryColor={primaryColor}
          style={style.infoBtn}
          onClick={() => setShowInfoPopup(false)}
        >
          {t('photo.hud.addDamage.infoBtn')}
        </Button>
      )}
    </div>
  );
}
