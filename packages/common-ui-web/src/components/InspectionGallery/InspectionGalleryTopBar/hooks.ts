import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from './InspectionGalleryTopBar.styles';

export function useInspectionGalleryTopBarStyles() {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  return {
    barStyle: {
      ...styles['bar'],
      ...responsive(styles['barSmallScreen']),
      backgroundColor: palette.background.base,
    },
    leftContainerStyle: styles['leftContainer'],
    pillContainerStyle: {
      ...styles['pillContainer'],
      ...responsive(styles['pillContainerSmallScreen']),
    },
    backButtonStyle: {
      ...styles['backButton'],
      ...responsive(styles['backButtonSmallScreen']),
    },
    titleStyle: {
      ...styles['title'],
      color: palette.text.primary,
    },
  };
}
