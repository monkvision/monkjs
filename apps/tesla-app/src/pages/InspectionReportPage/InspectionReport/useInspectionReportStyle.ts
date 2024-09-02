import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from './InspectionReport.styles';

export function useInspectionReportStyles() {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  return {
    vehicle360Style: {
      ...styles['vehicle360'],
      ...responsive(styles['vehicle360SmallScreen']),
      // backgroundColor: palette.background.base,
    },
    galleryStyle: {
      ...styles['gallery'],
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
