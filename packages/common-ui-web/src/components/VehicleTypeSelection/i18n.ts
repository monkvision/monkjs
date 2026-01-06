import { i18nCreateSDKInstance } from '@monkvision/common';
import en from './translations/en.json';
import ro from './translations/ro.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import nl from './translations/nl.json';
import it from './translations/it.json';

const i18nVehicleTypeSelection = i18nCreateSDKInstance({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
    nl: { translation: nl },
    it: { translation: it },
    ro: { translation: ro },
  },
});

export { i18nVehicleTypeSelection };
