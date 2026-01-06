/**
 * An array containing Monk available languages.
 */
export const monkLanguages = ['fr', 'en', 'de', 'nl', 'it', 'ro'] as const;

/**
 * Represents a Monk language type, which is one of the available Monk languages.
 */
export type MonkLanguage = (typeof monkLanguages)[number];

/**
 * Represents a translation object where each language is associated to a string.
 */
export type TranslationObject = Record<MonkLanguage, string>;
