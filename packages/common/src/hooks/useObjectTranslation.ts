import { TranslationObject } from '@monkvision/types';
import { useTranslation, UseTranslationOptions } from 'react-i18next';
import { useCallback } from 'react';
import { getLanguage } from '../i18n';

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
export function useObjectTranslation(
  ns?: string,
  options?: UseTranslationOptions<any>,
): UseObjectTranslationResult {
  const { i18n } = useTranslation(ns, options);
  const language = options?.lng ? options.lng : i18n.language;
  const tObj = useCallback(
    (obj: TranslationObject) => {
      return obj[getLanguage(language)] ?? 'translation-not-found';
    },
    [i18n.language],
  );
  return { tObj };
}
