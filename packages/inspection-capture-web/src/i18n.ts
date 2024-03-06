import { i18nCreateSDKInstance, i18nLinkSDKInstances } from '@monkvision/common';
import { i18nCamera } from '@monkvision/camera-web';
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

/**
 * i18n instance of the Inspection CApture Web package. You can use this instance to automatically sync your application
 * current language with the one used by the components of the package.
 */
const i18nInspectionCaptureWeb = i18nCreateSDKInstance({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
  },
});

i18nLinkSDKInstances(i18nInspectionCaptureWeb, [i18nCamera]);

export { i18nInspectionCaptureWeb };
