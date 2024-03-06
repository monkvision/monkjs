import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useMonitoring } from '@monkvision/monitoring';
import { MonkLanguage, monkLanguages } from '@monkvision/types';

/**
 * Custom hook used internally by the Monk SDK components to handle the `lang` prop tha tcan be passed to them to
 * manage the current language displayed by the component.
 */
export function useLangProp(lang?: string): void {
  if (lang && !monkLanguages.includes(lang as MonkLanguage)) {
    throw new Error(
      `Unsupported language : "${lang}". Languages supported by the Monk SDK are : ${monkLanguages}.`,
    );
  }
  const { i18n } = useTranslation();
  const { handleError } = useMonitoring();

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang).catch(handleError);
    }
  }, [i18n, lang]);
}
