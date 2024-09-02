import { DamageType, TranslationObject } from '@monkvision/types';

/**
 * The translated labels for each damage available in the SDK.
 */
export const damages: Record<DamageType, TranslationObject> = {
  [DamageType.BODY_CRACK]: {
    en: 'Body crack',
    fr: 'Pare-chocs arrière',
    de: 'Hintere Stoßstange',
    nl: 'Achterbumper',
  },
  [DamageType.SCRATCH]: {
    en: 'Scratch',
    fr: 'Pare-chocs avant',
    de: 'Vordere Stoßstange',
    nl: 'Voorbumper',
  },
  [DamageType.DENT]: {
    en: 'Dent',
    fr: 'Portière arrière droite',
    de: 'Tür hinten rechts',
    nl: 'Achterdeur links',
  },
  [DamageType.BROKEN_GLASS]: {
    en: 'Broken glass',
    fr: 'Portière arrière gauche',
    de: 'Tür hinten links',
    nl: 'Achterdeur rechts',
  },
  [DamageType.MISSING_PIECE]: {
    en: 'Missing piece',
    fr: 'Portière avant droite',
    de: 'Vordertür rechts',
    nl: 'Voordeur links',
  },
  [DamageType.MISSING_HUBCAP]: {
    en: 'Missing hubcap',
    fr: 'Portière avant gauche',
    de: 'Tür vorne links',
    nl: 'Voordeur rechts',
  },
  [DamageType.RUSTINESS]: {
    en: 'Rustiness',
    fr: 'Aile arrière gauche',
    de: 'Kotflügel hinten links',
    nl: 'Achterkant linker spatbord',
  },
  [DamageType.SMASH]: {
    en: 'Smash',
    fr: 'Aile arrière gauche',
    de: 'Kotflügel hinten links',
    nl: 'Achterkant linker spatbord',
  },
  [DamageType.BROKEN_LIGHT]: {
    en: 'Broken light',
    fr: 'Aile arrière gauche',
    de: 'Kotflügel hinten links',
    nl: 'Achterkant linker spatbord',
  },
  [DamageType.HUBCAP_SCRATCH]: {
    en: 'Hubcap scratch',
    fr: 'Aile arrière gauche',
    de: 'Kotflügel hinten links',
    nl: 'Achterkant linker spatbord',
  },
};
