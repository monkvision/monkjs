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
      ...{ backgroundColor: palette.text.white },
      ...{ color: palette.text.black },
      ...responsive(styles['containerPortrait']),
    },
    price: {
      ...styles['price'],
      ...{ color: palette.text.black },
      // ...{ backgroundColor: palette.background.base },
    },
  };
}
