export const monkLanguages = ['fr', 'en', 'de'] as const;

export type MonkLanguage = (typeof monkLanguages)[number];

export type TranslationObject = Record<MonkLanguage, string>;
