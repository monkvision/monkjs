import { LabelDictionary, Sight } from '@monkvision/types';
import { useObjectTranslation } from './useObjectTranslation';

export interface UseSightLabelResult {
  label: (sight: Sight) => string;
}

export interface UseSightLabelParams {
  labels: LabelDictionary;
}

export function useSightLabel({ labels }: UseSightLabelParams): UseSightLabelResult {
  const { tObj } = useObjectTranslation();
  return {
    label: (sight) => {
      const translationObject = labels[sight.label];
      return translationObject ? tObj(translationObject) : `translation-not-found[${sight.label}]`;
    },
  };
}
