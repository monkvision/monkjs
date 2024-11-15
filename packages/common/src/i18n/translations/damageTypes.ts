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
  [DamageType.DIRT]: {
    en: 'Dirt',
    fr: 'Saleté',
    de: 'Dreck',
    nl: 'Vuil',
  },
  [DamageType.MISSHAPE]: {
    en: 'Misshape',
    fr: 'Forme irrégulière',
    de: 'Fehlform',
    nl: 'Misvorm',
  },
  [DamageType.PAINT_PEELING]: {
    en: 'Paint Peeling',
    fr: 'Peinture écaillée',
    de: 'Abblätternde Farbe',
    nl: 'Afbladderende verf',
  },
  [DamageType.SCATTERED_SCRATCHES]: {
    en: 'Scattered Scratches',
    fr: 'Rayures éparses',
    de: 'Verstreute Kratzer',
    nl: 'Verspreide krassen',
  },
  [DamageType.LIGHT_REFLECTION]: {
    en: 'Light Reflection',
    fr: 'Réflexion de la lumière',
    de: 'Lichtreflexion',
    nl: 'Licht Reflectie',
  },
  [DamageType.SHADOW]: {
    en: 'Shadow',
    fr: 'Ombre',
    de: 'Schatten',
    nl: 'Schaduw',
  },
  [DamageType.CAR_CURVE]: {
    en: 'Car Curve',
    fr: 'Courbe de la voiture',
    de: 'Auto-Kurve',
    nl: 'Auto kromming',
  },
  [DamageType.PAINT_DAMAGE]: {
    en: 'Paint Damage',
    fr: 'Dégât sur la peinture',
    de: 'Lackschäden',
    nl: 'Beschadigde verf',
  },
};
