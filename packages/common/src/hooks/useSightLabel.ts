import { LabelDictionary, Sight } from '@monkvision/types';
import { useCallback } from 'react';
import { useObjectTranslation } from './useObjectTranslation';

/**
 * The result of the useSightLabel. It contains a function which takes a Sight object and return the
 * translated label sync with the actual selected language.
 */
export interface UseSightLabelResult {
  label: (sight: Sight) => string;
}

/**
 * Parameters given to the useSightLabel hook.
 */
export interface UseSightLabelParams {
  /**
   * A dictionary of label translations objects.
   */
  labels: LabelDictionary;
}

/**
 * Custom hook used to get the label of a sight with the currently selected language.
 */
export function useSightLabel({ labels }: UseSightLabelParams): UseSightLabelResult {
  const { tObj } = useObjectTranslation();
  const label = useCallback(
    (sight: Sight) => {
      const translationObject = labels[sight.label];
      return translationObject ? tObj(translationObject) : `translation-not-found[${sight.label}]`;
    },
    [tObj, labels],
  );

  return { label };
}
