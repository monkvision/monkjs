import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './SightSlider.styles';

export interface SightsSliderHUDStyle {
  container: CSSProperties;
}

export function useSightSliderStyles(): SightsSliderHUDStyle {
  const { responsive } = useResponsiveStyle();

  return {
    container: {
      ...styles['container'],
      ...responsive(styles['containerPortrait']),
    },
  };
}
