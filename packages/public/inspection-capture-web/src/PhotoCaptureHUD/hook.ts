import { CSSProperties } from 'react';
import { i18nCreateSDKInstance, useResponsiveStyle } from '@monkvision/common';
import { styles } from './PhotoCaptureHUD.styles';
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

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

export const i18nAddDamage = i18nCreateSDKInstance({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
  },
});

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
