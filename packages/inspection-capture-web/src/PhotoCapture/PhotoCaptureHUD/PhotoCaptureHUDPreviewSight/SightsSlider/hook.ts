import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './SightsSlider.styles';

export interface SightsSliderHUDStyle {
  container: CSSProperties;
}

export function useSightsSliderStyle(): SightsSliderHUDStyle {
  const { responsive } = useResponsiveStyle();

  return {
    container: {
      ...styles['container'],
      ...responsive(styles['containerPortrait']),
    },
  };
}
