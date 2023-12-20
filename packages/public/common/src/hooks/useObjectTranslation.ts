import { MonkLanguage, TranslationObject } from '@monkvision/types';
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
  tObj: (obj: TranslationObject) => string;
}

/**
 * Custom hook used to get the label with the actual selected language.
 */
export function useObjectTranslation(): UseObjectTranslationResult {
  const { i18n } = useTranslation();
  const tObj = (obj: TranslationObject) => {
    const lang = i18n.language.slice(0, 2) as MonkLanguage;
    return obj[lang] ?? 'translation-not-found';
  };
  return { tObj };
}
