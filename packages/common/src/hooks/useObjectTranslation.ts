import { MonkLanguage, TranslationObject } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

/**
 * The result of the useObjectTranslation. It contains a function which takes a LabelTranslation object and return the
 * translated label sync with the actual selected language.
 */
export interface UseObjectTranslationResult {
  /**
   * Function translating a LabelTranslation object into a translated label sync with the actual selected language.
   */
  tObj: (obj: TranslationObject) => string;
}

/**
 * Custom hook used to get a translation function tObj that translates TranslationObjects.
 */
export function useObjectTranslation(): UseObjectTranslationResult {
  const { i18n } = useTranslation();
  const tObj = useCallback(
    (obj: TranslationObject) => {
      const lang = i18n.language.slice(0, 2) as MonkLanguage;
      return obj[lang] ?? 'translation-not-found';
    },
    [i18n.language],
  );
  return { tObj };
}
