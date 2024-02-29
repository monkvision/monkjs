import {
  expectComponentToPassDownRefToHTMLElement,
  expectPropsOnChildMock,
} from '@monkvision/test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { createInstance, i18n, Resource } from 'i18next';
import { FC, forwardRef } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { useMonitoring } from '@monkvision/monitoring';
import { i18nCreateSDKInstance, i18nLinkSDKInstances, i18nWrap, useI18nLink } from '../../src';

describe('Monkvision i18n utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('i18nLinkSDKInstances function', () => {
    it('should add an event listener to the languageChanged event of the main instance', () => {
      const instance = { on: jest.fn() };
      const sdkInstances = [
        { changeLanguage: jest.fn(() => Promise.resolve(undefined)) },
        { changeLanguage: jest.fn(() => Promise.resolve(undefined)) },
        { changeLanguage: jest.fn(() => Promise.resolve(undefined)) },
      ];

      i18nLinkSDKInstances(instance as unknown as i18n, sdkInstances as unknown as i18n[]);
      expect(instance.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
      const newLanguage = 'newLang';
      instance.on.mock.calls[0][1](newLanguage);
      sdkInstances.forEach((sdkInstance) => {
        expect(sdkInstance.changeLanguage).toHaveBeenCalledWith(newLanguage);
      });
    });
  });

  describe('useI18nLink hook', () => {
    it('should create an effect changing the languages of the SDK libraries', () => {
      const instance = { language: 'fr' };
      const sdkInstances = [
        { changeLanguage: jest.fn(() => Promise.resolve(undefined)) },
        { changeLanguage: jest.fn(() => Promise.resolve(undefined)) },
        { changeLanguage: jest.fn(() => Promise.resolve(undefined)) },
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
      const err1 = 'err1';
      const err2 = 'err2';
      const instance = { language: 'fr' };
      const sdkInstances = [
        { changeLanguage: jest.fn(() => Promise.resolve(undefined)) },
        { changeLanguage: jest.fn(() => Promise.reject(err1)) },
        { changeLanguage: jest.fn(() => Promise.reject(err2)) },
      ];
      const { unmount } = renderHook(
        ({ instance: inst, sdkInstances: sdkInst }) =>
          useI18nLink(inst as unknown as i18n, sdkInst as unknown as i18n[]),
        { initialProps: { instance, sdkInstances } },
      );

      const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;
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

      const instanceMock = (createInstance as jest.Mock).mock.results[0].value;
      expect(createInstance).toHaveBeenCalledWith({
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
      const instance = { test: 'test' };
      const Wrapped = i18nWrap(TestComponent, instance as unknown as i18n);

      const { unmount } = render(<Wrapped />);

      expectPropsOnChildMock(I18nextProvider, { i18n: instance });

      expect(screen.queryByTestId(TEST_COMPONENT_TEST_ID)).not.toBeNull();
      unmount();
    });

    it('should pass all the props down to the wrapped component', () => {
      const id = 'test-id';
      const instance = { test: 'test' };
      const Wrapped = i18nWrap(TestComponent, instance as unknown as i18n);

      const { unmount } = render(<Wrapped id={id} />);

      expectPropsOnChildMock(TestComponent, { id });
      unmount();
    });

    it('should forward the ref to the wrapped component', () => {
      const instance = { test: 'test' };
      const ForwardRefTestComponent = forwardRef<HTMLDivElement>((_, ref) => (
        <div ref={ref} data-testid={TEST_COMPONENT_TEST_ID}></div>
      ));
      const Wrapped = i18nWrap(ForwardRefTestComponent, instance as unknown as i18n);

      expectComponentToPassDownRefToHTMLElement(Wrapped, TEST_COMPONENT_TEST_ID);
    });
  });
});
