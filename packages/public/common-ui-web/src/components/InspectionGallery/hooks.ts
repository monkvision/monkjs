import { CSSProperties } from 'react';
import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from './InspectionGallery.styles';

export interface InspectionGalleryStyle {
  content: CSSProperties;
  text: CSSProperties;
}

export function useInspectionGallery(): InspectionGalleryStyle {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();
  return {
    content: {
      ...styles['content'],
      ...responsive(styles['contentSmallScreen']),
      ...responsive(styles['contentMediumScreen']),
    },
    text: {
      ...styles['text'],
      color: palette.text.white,
    },
  };
}
