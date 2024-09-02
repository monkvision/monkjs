import { CSSProperties } from 'react';
import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from '../DamageManipulator.styles';

export interface DamageManipulatorStyle {
  container: CSSProperties;
  price: CSSProperties;
}

export function useDamageManipulatorStyle(): DamageManipulatorStyle {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();
  return {
    container: {
      ...styles['container'],
      ...{ backgroundColor: palette.background.base },
      ...{ color: palette.text.white },
      ...responsive(styles['containerPortrait']),
    },
    price: {
      ...styles['price'],
      ...{ backgroundColor: palette.background.base },
    },
  };
}
