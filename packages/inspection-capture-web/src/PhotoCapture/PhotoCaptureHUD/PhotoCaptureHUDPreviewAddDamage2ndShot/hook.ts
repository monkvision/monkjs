import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDPreviewAddDamage2ndShot.styles';

export interface PhotoCaptureHUDPreviewAddDamage2ndShotStyle {
  top: CSSProperties;
  infoCloseup: CSSProperties;
  frame: CSSProperties;
}

export function usePhotoCaptureHUDPreviewAddDamage2ndShotStyle(): PhotoCaptureHUDPreviewAddDamage2ndShotStyle {
  const { responsive } = useResponsiveStyle();

  return {
    top: {
      ...styles['top'],
      ...responsive(styles['topLandscape']),
    },
    frame: {
      ...styles['frame'],
      ...responsive(styles['framePortrait']),
    },
    infoCloseup: {
      ...styles['infoCloseup'],
      ...responsive(styles['infoCloseupPortrait']),
    },
  };
}
