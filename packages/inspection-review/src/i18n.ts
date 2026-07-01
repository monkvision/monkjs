import { i18nCreateSDKInstance } from '@monkvision/common';
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import nl from './translations/nl.json';
import it from './translations/it.json';
import enIE from './translations/en-IE.json';
import enGB from './translations/en-GB.json';

/**
 * i18n instance of the Inspection Review package. You can use this instance to automatically
 * sync your application's current language with the one used by the components of the package.
 */
export const i18nInspectionReview = i18nCreateSDKInstance({
  resources: {
    'en': { translation: en },
    'fr': { translation: fr },
    'de': { translation: de },
    'nl': { translation: nl },
    'it': { translation: it },
    'en-IE': { translation: enIE },
    'en-GB': { translation: enGB },
  },
});
