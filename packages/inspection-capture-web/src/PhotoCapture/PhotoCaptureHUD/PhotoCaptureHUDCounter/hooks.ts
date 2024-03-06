import { useTranslation } from 'react-i18next';
import { PhotoCaptureMode } from '../../hooks';

/**
 * Props of the PhotoCaptureHUDCounter component.
 */
export type PhotoCaptureHUDCounterProps =
  | {
      /**
       * The current mode of the PhotoCapture component.
       */
      mode: PhotoCaptureMode.SIGHT;
      /**
       * The total number of sights given to the PhotoCapture component.
       */
      totalSights: number;
      /**
       * The total number of sights taken by the user.
       */
      sightsTaken: number;
    }
  | {
      /**
       * The current mode of the PhotoCapture component.
       */
      mode: PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT | PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT;
    };

export function usePhotoCaptureHUDCounterLabel(props: PhotoCaptureHUDCounterProps): string {
  const { t } = useTranslation();

  if (props.mode === PhotoCaptureMode.SIGHT) {
    return `${props.sightsTaken} / ${props.totalSights}`;
  }
  if (props.mode === PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT) {
    return t('photo.hud.addDamage.damagedPartCounter');
  }
  return t('photo.hud.addDamage.closeupPictureCounter');
}
