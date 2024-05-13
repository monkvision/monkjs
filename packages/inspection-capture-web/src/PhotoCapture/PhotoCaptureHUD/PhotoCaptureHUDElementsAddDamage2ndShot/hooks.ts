import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDElementsAddDamage2ndShot.styles';

export interface PhotoCaptureHUDElementsAddDamage2ndShotStyle {
  top: CSSProperties;
  infoCloseup: CSSProperties;
  frame: CSSProperties;
}

export function usePhotoCaptureHUDElementsAddDamage2ndShotStyle(): PhotoCaptureHUDElementsAddDamage2ndShotStyle {
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
