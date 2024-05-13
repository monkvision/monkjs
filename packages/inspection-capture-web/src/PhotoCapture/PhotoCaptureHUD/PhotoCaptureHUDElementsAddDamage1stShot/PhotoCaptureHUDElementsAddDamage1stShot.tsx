import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { usePhotoCaptureHUDButtonBackground } from '../hooks';
import { styles } from './PhotoCaptureHUDElementsAddDamage1stShot.styles';
import { PhotoCaptureHUDCounter } from '../PhotoCaptureHUDCounter';
import { PhotoCaptureMode } from '../../hooks';
import { PhotoCaptureHUDCancelButton } from '../PhotoCaptureHUDCancelButton';
import { crosshairSvg } from '../../../assets';
import { usePhotoCaptureHUDElementsAddDamage1stShotStyles } from './hooks';

/**
 * Props of the PhotoCaptureHUDElementsAddDamage1stShot component.
 */
export interface PhotoCaptureHUDElementsAddDamage1stShotProps {
  /**
   * Callback called when the user cancels the Add Damage mode.
   */
  onCancel?: () => void;
}

/**
 * Component implementing an HUD displayed on top of the Camera preview during the PhotoCapture process when the current
 * mode is ADD_DAMAGE_1ST_SHOT.
 */
export function PhotoCaptureHUDElementsAddDamage1stShot({
  onCancel,
}: PhotoCaptureHUDElementsAddDamage1stShotProps) {
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const { t } = useTranslation();
  const primaryColor = usePhotoCaptureHUDButtonBackground();
  const style = usePhotoCaptureHUDElementsAddDamage1stShotStyles();

  return (
    <div style={styles['container']}>
      <DynamicSVG style={styles['svg']} svg={crosshairSvg} />
      <div style={style.top}>
        <PhotoCaptureHUDCounter mode={PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT} />
        <PhotoCaptureHUDCancelButton onCancel={onCancel} />
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
