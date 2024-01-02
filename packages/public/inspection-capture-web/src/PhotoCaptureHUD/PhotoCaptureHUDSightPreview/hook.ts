import { CSSProperties } from 'react';
import { styles } from './PhotoCaptureHUDSightPreview.styles';
import { useCameraConfig } from '../../hooks/useCameraConfig';

export interface PhotoCaptureHUDSightPreview {
  container: CSSProperties;
  top: CSSProperties;
  overlay: CSSProperties;
}

export function usePhotoCaptureHUDSightPreview(): PhotoCaptureHUDSightPreview {
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
