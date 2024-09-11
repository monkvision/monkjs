import { DamageType, TranslationObject } from '@monkvision/types';

/**
 * The translated labels for each damage type available in the SDK.
 */
export const damageTypeLabels: Record<DamageType, TranslationObject> = {
  [DamageType.SCRATCH]: {
    en: 'Scratch',
    fr: 'Rayure',
    de: 'Kratzer',
    nl: 'Kras',
  },
  [DamageType.DENT]: {
    en: 'Dent',
    fr: 'Bosse',
    de: 'Beule',
    nl: 'Deuk',
  },
  [DamageType.BROKEN_GLASS]: {
    en: 'Broken Glass',
    fr: 'Bris de glace',
    de: 'Zerbrochenes Glas',
    nl: 'Gebroken glas',
  },
  [DamageType.BROKEN_LIGHT]: {
    en: 'Broken Light',
    fr: 'Feu cassé',
    de: 'Kaputtem Licht',
    nl: 'Gebroken licht',
  },
  [DamageType.HUBCAP_SCRATCH]: {
    en: 'Hubcap Scratch',
    fr: 'Enjoliveur rayé',
    de: 'Zerkratzte Radkappe',
    nl: 'Gebroken wieldop',
  },
  [DamageType.MISSING_HUBCAP]: {
    en: 'Missing Hubcap',
    fr: 'Enjoliveur manquant',
    de: 'Fehlende Radkappe',
    nl: 'Ontbrekende wieldop',
  },
  [DamageType.SMASH]: {
    en: 'Smash',
    fr: 'Collision',
    de: 'Zusammenstoß',
    nl: 'Botsing',
  },
  [DamageType.BODY_CRACK]: {
    en: 'Body Crack',
    fr: 'Fissure dans la carrosserie',
    de: 'Karosserieriss',
    nl: 'Carrosseriescheur',
  },
  [DamageType.MISSING_PIECE]: {
    en: 'Missing Piece',
    fr: 'Pièce manquante',
    de: 'Fehlendes Teil',
    nl: 'Ontbrekend onderdeel',
  },
  [DamageType.RUSTINESS]: {
    en: 'Rustiness',
    fr: 'Rouille',
    de: 'Rostigkeit',
    nl: 'Roest',
  },
};
