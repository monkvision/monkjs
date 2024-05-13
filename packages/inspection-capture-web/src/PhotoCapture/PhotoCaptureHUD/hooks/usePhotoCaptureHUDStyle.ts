import { useResponsiveStyle } from '@monkvision/common';
import { styles } from '../PhotoCaptureHUD.styles';

export function usePhotoCaptureHUDStyle() {
  const { responsive } = useResponsiveStyle();

  return {
    container: {
      ...styles['container'],
      ...responsive(styles['containerPortrait']),
    },
    previewContainer: styles['previewContainer'],
  };
}
