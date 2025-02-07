import { AddDamage } from '@monkvision/types';
import { styles } from './SightGuideline.styles';
import { useColorBackground } from '../../../../hooks';

export interface SightGuidelineParams {
  addDamage?: AddDamage;
}

export function useSightGuidelineStyle({ addDamage }: SightGuidelineParams) {
  const backgroundColor = useColorBackground();

  return {
    container: addDamage === AddDamage.DISABLED ? styles['containerWide'] : styles['container'],
    guideline: {
      ...styles['guideline'],
      backgroundColor,
    },
  };
}
