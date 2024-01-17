import { CSSProperties } from 'react';
import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from '../DamageManipulator.styles';

export interface DamageManipulatorStyle {
  container: CSSProperties;
}

export function useDamageManipulatorStyle(): DamageManipulatorStyle {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();
  return {
    container: {
      ...styles['container'],
      ...{ backgroundColor: palette.grey.xdark },
      ...{ color: palette.text.white },
      ...responsive(styles['containerPortrait']),
    },
  };
}
