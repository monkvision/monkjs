import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './CloseUpShot.styles';

export interface CloseUpShotStyle {
  top: CSSProperties;
  infoCloseup: CSSProperties;
  frame: CSSProperties;
}

export function useCloseUpShotStyle(): CloseUpShotStyle {
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
