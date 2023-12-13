import { LabelTranslation } from '@monkvision/types';
import { useTranslation } from 'react-i18next';

export function useObjectTranslation(): {
  tObj: (label: LabelTranslation) => string;
} {
  const { i18n } = useTranslation();
  return {
    tObj: (label) => {
      const lang: string = i18n.language.slice(0, 2);
      switch (lang) {
        case 'en':
          return label.en;
        case 'fr':
          return label.fr;
        case 'de':
          return label.de;
        default:
          return label.en;
      }
    },
  };
}
