import { useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { styles } from './CaptureSelection.styles';

export function useCaptureSelectionStyles() {
  const { responsive } = useResponsiveStyle();
  const { palette } = useMonkTheme();

  return {
    container: {
      ...styles['container'],
      ...responsive(styles['containerSmall']),
    },
    contentContainer: {
      ...styles['contentContainer'],
      ...responsive(styles['contentContainerSmall']),
    },
    description: { color: palette.secondary.xlight, ...styles['description'] },
  };
}
