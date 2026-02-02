import { i18nCreateSDKInstance } from '@monkvision/common';
import en from './translations/en.json';
import nl from './translations/nl.json';
import de from './translations/de.json';
import fr from './translations/fr.json';
import pl from './translations/pl.json';
import da from './translations/da.json';
import sv from './translations/sv.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import ro from './translations/ro.json';

/**
 * i18n instance of the CreateInspection component. You can use this instance to automatically sync your application
 * current language with the one used by the components of the package.
 */
const i18nCreateInspection = i18nCreateSDKInstance({
  resources: {
    en: { translation: en },
    ro: { translation: ro },
    pt: { translation: pt },
    es: { translation: es },
    sv: { translation: sv },
    da: { translation: da },
    pl: { translation: pl },
    fr: { translation: fr },
    de: { translation: de },
    nl: { translation: nl },
  },
});

export { i18nCreateInspection };
