import { CSSProperties } from 'react';
import { styles } from './PhotoCaptureHUDSightPreview.styles';

export interface PhotoCaptureHUDSightPreviewStyle {
  container: CSSProperties;
  top: CSSProperties;
  overlay: CSSProperties;
}

export function usePhotoCaptureHUDSightPreviewStyle(): PhotoCaptureHUDSightPreviewStyle {
  return {
    container: {
      ...styles['container'],
    },
    top: {
      ...styles['top'],
    },
    overlay: {
      ...styles['overlay'],
      // aspectRatio: `${getCameraDimensions().width}/${getCameraDimensions().height}`,
      aspectRatio: '16/9',
    },
  };
}
