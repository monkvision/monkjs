import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { monkLanguages } from '@monkvision/types';
import en from './translations/en.json';
import sv from './translations/sv.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import nl from './translations/nl.json';
import it from './translations/it.json';

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    supportedLngs: monkLanguages,
    nonExplicitSupportedLngs: true,
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
  })
  .catch(console.error);

export default i18n;
