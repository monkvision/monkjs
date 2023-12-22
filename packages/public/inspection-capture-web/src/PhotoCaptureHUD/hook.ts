import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUD.styles';

export interface PhotoCaptureHUD {
  container: CSSProperties;
}

export function usePhotoCaptureHUD(): PhotoCaptureHUD {
  const { responsive } = useResponsiveStyle();
  return {
    container: {
      ...styles['container'],
      ...responsive(styles['containerPortrait']),
    },
  };
}
