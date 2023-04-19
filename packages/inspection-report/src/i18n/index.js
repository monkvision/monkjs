import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './resources';

const i18n = createInstance({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources,
});

i18n.use(initReactI18next).init();

export default i18n;
