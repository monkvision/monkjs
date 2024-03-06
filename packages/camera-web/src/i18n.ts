import { i18nCreateSDKInstance } from '@monkvision/common';
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

/**
 * i18n instance of the Camera package. You can use this instance to automatically sync your application current
 * language with the one used by the components of the package.
 */
export const i18nCamera = i18nCreateSDKInstance({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
  },
});
