import i18n from 'i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { i18nLinkSDKInstances } from '@monkvision/common';
import { i18nCamera } from '@monkvision/camera-web';
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    supportedLngs: ['en', 'fr'],
    nonExplicitSupportedLngs: true,
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
    },
  })
  .catch((err) => console.error(err));

i18nLinkSDKInstances(i18n, [i18nCamera]);

export default i18n;
