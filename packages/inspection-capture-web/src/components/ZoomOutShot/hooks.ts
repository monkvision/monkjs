import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './ZoomOutShot.styles';

export interface ZoomOutShotStyle {
  top: CSSProperties;
  infoBtn: CSSProperties;
}

export function useZoomOutShotStyles(): ZoomOutShotStyle {
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
