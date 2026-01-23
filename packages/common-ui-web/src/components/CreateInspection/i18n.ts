import { i18nCreateSDKInstance } from '@monkvision/common';
import en from './translations/en.json';
import ro from './translations/ro.json';
import pl from './translations/pl.json';
import da from './translations/da.json';
import sv from './translations/sv.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import nl from './translations/nl.json';
import it from './translations/it.json';

/**
 * i18n instance of the CreateInspection component. You can use this instance to automatically sync your application
 * current language with the one used by the components of the package.
 */
const i18nCreateInspection = i18nCreateSDKInstance({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
    nl: { translation: nl },
    it: { translation: it },
    pt: { translation: pt },
    es: { translation: es },
    sv: { translation: sv },
    da: { translation: da },
    pl: { translation: pl },
    ro: { translation: ro },
  },
});

export { i18nCreateInspection };
