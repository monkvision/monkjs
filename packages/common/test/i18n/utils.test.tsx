import { createMockI18nInstance, I18N_LANGUAGE_TEST_ID, I18nextProviderMock } from '../mocks';

const handleErrorMock = jest.fn();
jest.mock('@monkvision/monitoring', () => ({
  useMonitoring: jest.fn(() => ({ handleError: handleErrorMock })),
}));

const instanceMock = createMockI18nInstance();
const createInstanceMock = jest.fn(() => instanceMock);
jest.mock('i18next', () => ({ createInstance: createInstanceMock }));

import {
  expectComponentToPassDownRefToHTMLElement,
  expectPropsOnChildMock,
} from '@monkvision/test-utils';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import { i18n, Resource, ThirdPartyModule } from 'i18next';
import { FC, forwardRef, PropsWithChildren } from 'react';
import { initReactI18next } from 'react-i18next';
import { i18nCreateSDKInstance, i18nLinkSDKInstances, i18nWrap, useI18nLink } from '../../src';

jest.mock('react-i18next', () => ({
  initReactI18next: {} as ThirdPartyModule,
  I18nextProvider: (props: PropsWithChildren<{ i18n: i18n }>) => (
    <I18nextProviderMock i18n={props.i18n}>{props.children}</I18nextProviderMock>
  ),
}));

describe('Monkvision i18n utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('i18nLinkSDKInstances function', () => {
    it('should add an event listener to the languageChanged event of the main instance', () => {
      const instance = createMockI18nInstance();
      const sdkInstances = [
        createMockI18nInstance(),
        createMockI18nInstance(),
        createMockI18nInstance(),
      ];

      i18nLinkSDKInstances(instance as unknown as i18n, sdkInstances as unknown as i18n[]);
      const lng = 'test-lg';
      instance.fire('languageChanged', lng);

      sdkInstances.forEach((sdkInstance) => {
        expect(sdkInstance.changeLanguage).toHaveBeenCalledWith(lng);
      });
    });
  });

  describe('useI18nLink hook', () => {
    it('should create an effect changing the languages of the SDK libraries', () => {
      const instance = createMockI18nInstance();
      const sdkInstances = [
        createMockI18nInstance(),
        createMockI18nInstance(),
        createMockI18nInstance(),
      ];
      const { unmount, rerender } = renderHook(
        ({ instance: inst, sdkInstances: sdkInst }) =>
          useI18nLink(inst as unknown as i18n, sdkInst as unknown as i18n[]),
        { initialProps: { instance, sdkInstances } },
      );

      sdkInstances.forEach((sdkInstance) => {
        expect(sdkInstance.changeLanguage).toHaveBeenCalledWith(instance.language);
      });
      instance.language = 'test-lg-2';
      rerender({ instance, sdkInstances });
      sdkInstances.forEach((sdkInstance) => {
        expect(sdkInstance.changeLanguage).toHaveBeenCalledWith(instance.language);
      });
      unmount();
    });

    it('should call handleError if an error occurs when changing language', async () => {
      const instance = createMockI18nInstance();
      const err1 = 'err1';
      const err2 = 'err2';
      const sdkInstances = [
        createMockI18nInstance(),
        createMockI18nInstance({ changeLanguage: () => Promise.reject(err1) }),
        createMockI18nInstance({ changeLanguage: () => Promise.reject(err2) }),
      ];
      const { unmount } = renderHook(
        ({ instance: inst, sdkInstances: sdkInst }) =>
          useI18nLink(inst as unknown as i18n, sdkInst as unknown as i18n[]),
        { initialProps: { instance, sdkInstances } },
      );

      await waitFor(() => {
        expect(handleErrorMock).toHaveBeenCalledTimes(2);
        expect(handleErrorMock).toHaveBeenCalledWith(err1);
        expect(handleErrorMock).toHaveBeenCalledWith(err2);
      });
      unmount();
    });
  });

  describe('i18nCreateSDKInstance hook', () => {
    it('should initialize the i18n instance for SDK packages', () => {
      const resources: Resource = { en: { test: 'test-val' } };
      const instanceResult = i18nCreateSDKInstance({ resources });

      expect(createInstanceMock).toHaveBeenCalledWith({
        compatibilityJSON: 'v3',
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        resources,
      });
      expect(instanceMock.use).toHaveBeenCalledWith(initReactI18next);
      expect(instanceMock.init).toHaveBeenCalledTimes(1);
      expect(instanceResult).toBe(instanceMock);
    });
  });

  describe('i18nWrap function', () => {
    const TEST_COMPONENT_TEST_ID = 'test-component';
    const TestComponent = jest.fn(() => <div data-testid={TEST_COMPONENT_TEST_ID} />) as FC<{
      id?: string;
    }>;

    it('should wrap the component in a I18nextProvider with the given instance', () => {
      const instance = createMockI18nInstance();
      const Wrapped = i18nWrap(TestComponent, instance as unknown as i18n);

      const { rerender, unmount } = render(<Wrapped />);

      expect(screen.getByTestId(I18N_LANGUAGE_TEST_ID).textContent).toEqual(instance.language);
      const language = 'test-language-provider';
      instance.language = language;
      rerender(<Wrapped />);
      expect(screen.getByTestId(I18N_LANGUAGE_TEST_ID).textContent).toEqual(language);
      expect(screen.queryByTestId(TEST_COMPONENT_TEST_ID)).toBeDefined();
      unmount();
    });

    it('should pass all the props down to the wrapped component', () => {
      const id = 'test-id';
      const instance = createMockI18nInstance();
      const Wrapped = i18nWrap(TestComponent, instance as unknown as i18n);

      const { unmount } = render(<Wrapped id={id} />);

      expectPropsOnChildMock(TestComponent as jest.Mock, { id });
      unmount();
    });

    it('should forward the ref to the wrapped component', () => {
      const instance = createMockI18nInstance();
      const ForwardRefTestComponent = forwardRef<HTMLDivElement>((_, ref) => (
        <div ref={ref} data-testid={TEST_COMPONENT_TEST_ID}></div>
      ));
      const Wrapped = i18nWrap(ForwardRefTestComponent, instance as unknown as i18n);

      expectComponentToPassDownRefToHTMLElement(Wrapped, TEST_COMPONENT_TEST_ID);
    });
  });
});
