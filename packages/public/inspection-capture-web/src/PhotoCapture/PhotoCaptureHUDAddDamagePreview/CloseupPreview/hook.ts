import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './CloseupPreview.styles';

export function useCloseupPreviewStyle() {
  const { responsive } = useResponsiveStyle();
  return {
    label: {
      ...styles['label'],
      ...responsive(styles['labelPortrait']),
    },
  };
}
