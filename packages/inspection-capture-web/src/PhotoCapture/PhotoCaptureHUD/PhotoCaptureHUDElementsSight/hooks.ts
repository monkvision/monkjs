import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDPreviewSight.styles';

export interface PhotoCaptureHUDSightPreviewStyle {
  container: CSSProperties;
  top: CSSProperties;
  overlay: CSSProperties;
}

export function usePhotoCaptureHUDSightPreviewStyle(): PhotoCaptureHUDSightPreviewStyle {
  const { responsive } = useResponsiveStyle();

  return {
    container: {
      ...styles['container'],
    },
    top: {
      ...styles['top'],
      ...responsive(styles['topLandscape']),
    },
    overlay: {
      ...styles['overlay'],
    },
  };
}
