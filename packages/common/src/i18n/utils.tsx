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
import { I18nextProvider, initReactI18next } from 'react-i18next';

/**
 * Use this function during your i18n initialization in order to synchronize your i18n instance with the ones used and
 * provided by the Monk SDK packages.
 *
 * **IMPORTANT NOTE : It is highly recommended to also use the `useI18nLink` hook in pair with this function for
 * optimal results.**
 *
 * @param instance The i18n instance of your application.
 * @param sdkInstances The array of i18n instances used by the Monk SDK packages used in your app.
 * @see useI18nLink
 * @example
 * import i18n from 'i18next';
 * import { i18nInspectionCapture } from '@monkvision/inspection-capture-web';
 * import { i18nInspectionReport } from '@monkvision/inspection-report-web';
 *
 * i18n.use(initReactI18next).init(...);
 * i18nLinkSDKInstances(i18n, [i18nInspectionCapture, i18nInspectionReport]);
 * export default i18n;
 */
export function i18nLinkSDKInstances(instance: i18n, sdkInstances: i18n[]): void {
  instance.on('languageChanged', (lng: string) => {
    sdkInstances.forEach((sdkInstance) =>
      sdkInstance.changeLanguage(lng).catch((err) => console.error(err)),
    );
  });
}

/**
 * Use this hook inside your App component in order to synchronize your i18n instance with the ones used and provided
 * by the Monk SDK packages.
 *
 * **IMPORTANT NOTE : It is highly recommended to also use the `i18nLinkSDKInstances` function in pair with this hook
 * for optimal results.**
 *
 * @param instance The i18n instance of your application, obtained using the `useTranslation` hook.
 * @param sdkInstances The array of i18n instances used by the Monk SDK packages used in your app.
 * @see i18nLinkSDKInstances
 * @example
 * import React from 'react';
 * import { useI18nLink } from '@monkvision/common';
 * import { i18nInspectionCapture } from '@monkvision/inspection-capture-web';
 * import { i18nInspectionReport } from '@monkvision/inspection-report-web';
 * import { useTranslation } from 'react-i18next';
 *
 * export function App() {
 *   const { i18n } = useTranslation();
 *   useI18nLink(i18n, [i18nInspectionCapture, i18nInspectionReport]);
 *   ...
 * }
 */
export function useI18nLink(instance: i18n, sdkInstances: i18n[]): void {
  const { handleError } = useMonitoring();

  useEffect(() => {
    sdkInstances.forEach((sdkInstance) =>
      sdkInstance.changeLanguage(instance.language).catch((err) => handleError(err)),
    );
  }, [instance.language]);
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
  instance
    .use(initReactI18next)
    .init()
    .catch((err) => console.error(err));
  return instance;
}

/**
 * This function is used internally by the Monk SDK to wrap its exported components in an I18nextProvder. The ref passed
 * to the resulting component is forwarded to the wrapped component.
 *
 * @param Component The component to wrap in the provider.
 * @param instance The i18n instance created using the `i18nCreateSDKInstance` function.
 * @typeParam T - The type of the ref of the wrapped component.
 * @typeParam P - The type of the props of the wrapped component.
 * @return The Component passed in the arguments. wrapped in an I18nextProvider.
 */
export function i18nWrap<T, P>(
  Component: ComponentType<P>,
  instance: i18n,
): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  return forwardRef<T, P>((props, ref) => (
    <I18nextProvider i18n={instance}>
      <Component ref={ref} {...props} />
    </I18nextProvider>
  ));
}
