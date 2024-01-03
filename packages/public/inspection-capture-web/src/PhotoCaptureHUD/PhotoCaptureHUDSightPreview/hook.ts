import { CSSProperties } from 'react';
import { styles } from './PhotoCaptureHUDSightPreview.styles';
import { useCameraConfig } from '../../hooks/useCameraConfig';

export interface PhotoCaptureHUDSightPreviewStyle {
  container: CSSProperties;
  top: CSSProperties;
  overlay: CSSProperties;
}

export function usePhotoCaptureHUDSightPreviewStyle(): PhotoCaptureHUDSightPreviewStyle {
  const { getCameraDimensions } = useCameraConfig();
  return {
    container: {
      ...styles['container'],
    },
    top: {
      ...styles['top'],
    },
    overlay: {
      ...styles['overlay'],
      aspectRatio: `${getCameraDimensions().width}/${getCameraDimensions().height}`,
    },
  };
}
