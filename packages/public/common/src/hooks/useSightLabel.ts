import { LabelDictionary, Sight } from '@monkvision/types';
import { useObjectTranslation } from './useObjectTranslation';

/**
 * The result of the useSightLabel. It contains a function which takes a Sight object and return the
 * translated label sync with the actual selected language.
 */
export interface UseSightLabelResult {
  label: (sight: Sight) => string;
}

export interface UseSightLabelParams {
  /**
   * Function translating a Sight object into a translated label sync with the actual selected language.
   * @param obj
   */
  labels: LabelDictionary;
}

/**
 * Custom hook used to get the label with the actual selected language.
 */
export function useSightLabel({ labels }: UseSightLabelParams): UseSightLabelResult {
  const { tObj } = useObjectTranslation();
  return {
    label: (sight) => {
      const translationObject = labels[sight.label];
      return translationObject ? tObj(translationObject) : `translation-not-found[${sight.label}]`;
    },
  };
}
