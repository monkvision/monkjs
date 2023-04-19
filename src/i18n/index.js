import i18n from 'i18next';
import { i18nCamera } from '@monkvision/camera';
import { i18nDamageReport } from '@monkvision/inspection-report';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import resources from './resources';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  lng: Localization.locale,
  interpolation: {
    escapeValue: false,
  },
  resources,
  supportedLngs: ['en', 'fr'],
  nonExplicitSupportedLngs: true,
});

i18n.on(
  'languageChanged',
  (lng) => i18nCamera.changeLanguage(lng).catch((err) => console.error(err)),
  (lng) => i18nDamageReport.changeLanguage(lng).catch((err) => console.error(err)),
);

export default i18n;
