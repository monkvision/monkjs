import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDTutorial.styles';

export function usePhotoCaptureHUDTutorialStyle() {
  const { responsive } = useResponsiveStyle();

  return {
    elementsContainer: {
      ...styles['elementsContainer'],
      ...responsive(styles['elementsContainerPortrait']),
    },
  };
}
