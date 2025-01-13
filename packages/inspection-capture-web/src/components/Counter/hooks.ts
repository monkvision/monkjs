import { useTranslation } from 'react-i18next';
import { CaptureMode } from '../../types';

/**
 * Props of the Counter component.
 */
export type CounterProps =
  | {
      /**
       * The current mode of the PhotoCapture component.
       */
      mode: CaptureMode.SIGHT;
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
      mode:
        | CaptureMode.ADD_DAMAGE_1ST_SHOT
        | CaptureMode.ADD_DAMAGE_2ND_SHOT
        | CaptureMode.ADD_DAMAGE_PART_SELECT
        | CaptureMode.ADD_DAMAGE_PART_SELECT_SHOT;
    };

export function useCounterLabel(props: CounterProps): string {
  const { t } = useTranslation();

  if (props.mode === CaptureMode.SIGHT) {
    return `${props.sightsTaken} / ${props.totalSights}`;
  }
  if (props.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT) {
    return t('photo.hud.addDamage.damagedPartCounter');
  }
  return t('photo.hud.addDamage.closeupPictureCounter');
}
