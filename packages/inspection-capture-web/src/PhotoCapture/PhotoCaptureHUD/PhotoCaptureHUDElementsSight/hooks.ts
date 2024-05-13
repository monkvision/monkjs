import { PixelDimensions } from '@monkvision/types';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDElementsSight.styles';

export function usePhotoCaptureHUDSightPreviewStyle(streamDimensions?: PixelDimensions | null) {
  const { responsive } = useResponsiveStyle();
  const aspectRatio = `${streamDimensions?.width}/${streamDimensions?.height}`;

  return {
    container: styles['container'],
    elementsContainer: {
      ...styles['elementsContainer'],
      ...responsive(styles['elementsContainerPortrait']),
    },
    top: styles['top'],
    bottom: styles['bottom'],
    overlay: {
      ...styles['overlay'],
      aspectRatio,
    },
  };
}
