import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from '../PhotoCaptureHUD.styles';

export interface PhotoCaptureHUDStyle {
  container: CSSProperties;
  previewContainer: CSSProperties;
}

export function usePhotoCaptureHUDStyle(): PhotoCaptureHUDStyle {
  const { responsive } = useResponsiveStyle();

  return {
    container: {
      ...styles['container'],
      ...responsive(styles['containerPortrait']),
    },
    previewContainer: {
      ...styles['previewContainer'],
    },
  };
}
