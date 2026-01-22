import { i18nCreateSDKInstance } from '@monkvision/common';
import en from './translations/en.json';
import sv from './translations/sv.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import nl from './translations/nl.json';
import it from './translations/it.json';

const i18nInspectionGallery = i18nCreateSDKInstance({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
    nl: { translation: nl },
    it: { translation: it },
    pt: { translation: pt },
    es: { translation: es },
    sv: { translation: sv },
  },
});

export { i18nInspectionGallery };
