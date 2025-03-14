import { useMonitoring } from '@monkvision/monitoring';
import { createInstance, i18n, Resource } from 'i18next';
import {
  ComponentType,
  forwardRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  useEffect,
} from 'react';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import { MonkLanguage, monkLanguages } from '@monkvision/types';

/**
 * This custom hook automatically updates the current i18n instance's language with the given language if is it not null
 * and supported by the MonkJs SDK.
 */
export function useI18nSync(language?: string | null): void {
  const { i18n: instance } = useTranslation();
  const { handleError } = useMonitoring();

  useEffect(() => {
    if (!language) {
      return;
    }
    if (
      monkLanguages.every(
        (supportedLang) => !language.toLowerCase().startsWith(supportedLang.toLowerCase()),
      )
    ) {
      handleError(
        new Error(
          `Unsupported language passed to the MonkJs SDK : ${language}. Currently supported languages are : ${monkLanguages}.`,
        ),
      );
      return;
    }
    instance.changeLanguage(language).catch(handleError);
  }, [language, instance.changeLanguage]);
}

/**
 * Type definition for the options given to the i18nCreateSDKInstance function.
 */
export interface I18NSDKOptions {
  /**
   * The translation resources of the package.
   */
  resources: Resource;
}

/**
 * This utility function is used my Monk SDK packages to create an i18n instance that can be imported by applications
 * using them in order to link the different instances together (and synchronizes values such as the current language
 * etc.).
 *
 * @param resources The list of translations of the package.
 * @return A configured i18n instance.
 */
export function i18nCreateSDKInstance({ resources }: I18NSDKOptions): i18n {
  const instance = createInstance({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources,
  });
  instance.use(initReactI18next).init().catch(console.error);
  return instance;
}

/**
 * This function is used internally by the Monk SDK to wrap its exported components in an I18nextProvider. The ref
 * passed to the resulting component is forwarded to the wrapped component.
 *
 * @param Component The component to wrap in the provider. It should be an functional component
 * @param instance The i18n instance created using the `i18nCreateSDKInstance` function.
 * @typeParam T - The type of the ref of the wrapped component.
 * @typeParam P - The type of the props of the wrapped component.
 * @return The Component passed in the arguments. wrapped in an I18nextProvider.
 */
export function i18nWrap<T, P>(
  Component: ComponentType<P>,
  instance: i18n,
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  return forwardRef<T, P>(function I18nWrappedComponent(props, ref) {
    return (
      <I18nextProvider i18n={instance}>
        <Component ref={ref} {...(props as P)} />
      </I18nextProvider>
    );
  });
}

/**
 * This function retrieves the language prefix from a given language string.
 * If the prefix is not found in the list of supported languages (monkLanguages in Types package), defaults to 'en'.
 *
 * @param language - The full language string (e.g., 'en-US', 'fr-CA').
 * @returns The language prefix if it is supported; otherwise, 'en'.
 */
export function getLanguage(language: string): MonkLanguage {
  const languagePrefix = language.slice(0, 2) as MonkLanguage;
  return monkLanguages.includes(languagePrefix) ? languagePrefix : 'en';
}
