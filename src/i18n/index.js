import * as Localisation from 'expo-localization';
import i18n from 'i18n-js';
import { english } from './en.json';
import { french } from './fr.json';

i18n.translations = {
  en: english,
  fr: french,
};

i18n.locale = Localisation.locale;
i18n.fallbacks = true;

export const locale = i18n.locale;

export const translate = i18n.t;

export default i18n;
