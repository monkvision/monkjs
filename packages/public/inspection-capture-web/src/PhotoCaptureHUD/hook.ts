import { CSSProperties } from 'react';
import { useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUD.styles';

/**
 * Enumeration of the different HUD mode view used in inspection capture web package
 */
export enum HUDMode {
  /**
   * Default mode
   */
  DEFAULT = 'default',
  /**
   * Add damage mode/preview
   */
  ADD_DAMAGE = 'add-damage',
}

export interface PhotoCaptureHUD {
  container: CSSProperties;
  previewContainer: CSSProperties;
}

export function usePhotoCaptureHUD(): PhotoCaptureHUD {
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
