import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUDPreviewAddDamage1stShot.styles';

export interface PhotoCaptureHUDPreviewAddDamage1stShotStyle {
  top: CSSProperties;
  infoBtn: CSSProperties;
}

export function usePhotoCaptureHUDPreviewAddDamage1stShotStyles(): PhotoCaptureHUDPreviewAddDamage1stShotStyle {
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
