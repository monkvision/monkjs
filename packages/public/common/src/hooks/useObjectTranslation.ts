import { LabelTranslation } from '@monkvision/types';
import { useTranslation } from 'react-i18next';

/**
 * The result of the useObjectTranslation. It contains a function which takes a LabelTranslation object and return the
 * translated label sync with the actual selected language.
 */
export interface UseObjectTranslationResult {
  /**
   * Function translating a LabelTranslation object into a translated label sync with the actual selected language.
   * @param obj
   */
  tObj: (obj: LabelTranslation) => string;
}

/**
 * Custom hook used to get the label with the actual selected language.
 */
export function useObjectTranslation(): UseObjectTranslationResult {
  const { i18n } = useTranslation();
  return {
    tObj: (obj) => {
      const lang = i18n.language.slice(0, 2);
      switch (lang) {
        case 'en':
          return obj.en;
        case 'fr':
          return obj.fr;
        case 'de':
          return obj.de;
        default:
          return obj.en;
      }
    },
  };
}
