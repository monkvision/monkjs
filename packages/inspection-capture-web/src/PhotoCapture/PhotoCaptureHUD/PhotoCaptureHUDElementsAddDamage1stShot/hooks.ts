import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDElementsAddDamage1stShot.styles';

export interface PhotoCaptureHUDElementsAddDamage1stShotStyle {
  top: CSSProperties;
  infoBtn: CSSProperties;
}

export function usePhotoCaptureHUDElementsAddDamage1stShotStyles(): PhotoCaptureHUDElementsAddDamage1stShotStyle {
  const { responsive } = useResponsiveStyle();

  return {
    top: {
      ...styles['top'],
      ...responsive(styles['topLandscape']),
    },
    infoBtn: {
      ...styles['infoBtn'],
      ...responsive(styles['infoBtnPortrait']),
    },
  };
}
