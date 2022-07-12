import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import resources from './resources';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: getLocales()[0].languageCode,
  interpolation: {
    escapeValue: false,
  },
  resources,
});

i18n.on('languageChanged', (lng) => {
  // i18nOtherLib.changeLanguage(lng);
});

export default i18n;
