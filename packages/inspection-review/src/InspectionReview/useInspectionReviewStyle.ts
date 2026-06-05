import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from './InspectionReview.styles';

export function useInspectionReviewStyles() {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  return {
    vehicle360Style: {
      ...styles['vehicle360'],
      ...responsive(styles['vehicle360SmallScreen']),
    },
    galleryStyle: {
      ...styles['gallery'],
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
