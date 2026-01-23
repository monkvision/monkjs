import {
  expectComponentToPassDownRefToHTMLElement,
  expectPropsOnChildMock,
} from '@monkvision/test-utils';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { createInstance, i18n, Resource } from 'i18next';
import { FC, forwardRef } from 'react';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import { getLanguage, i18nCreateSDKInstance, i18nWrap, useI18nSync } from '../../src';

describe('Monkvision i18n utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useI18nSync hook', () => {
    it('should update the language every time the language prop changes', async () => {
      let lang = 'fr';
      const { rerender, unmount } = renderHook(useI18nSync, { initialProps: lang });
      let instance = (useTranslation as jest.Mock).mock.results[0].value.i18n;
      await waitFor(() => expect(instance.changeLanguage).toHaveBeenCalledWith(lang));

      (useTranslation as jest.Mock).mockClear();
      lang = 'de';
      rerender(lang);
      instance = (useTranslation as jest.Mock).mock.results[0].value.i18n;
      await waitFor(() => expect(instance.changeLanguage).toHaveBeenCalledWith(lang));

      unmount();
    });

    it('should not update the language if the value is null', async () => {
      const { unmount } = renderHook(useI18nSync, { initialProps: null });
      const instance = (useTranslation as jest.Mock).mock.results[0].value.i18n;
      await waitFor(() => expect(instance.changeLanguage).not.toHaveBeenCalled());

      unmount();
    });

    it('should not update the language if the value is not a supported monk language', async () => {
      const { unmount } = renderHook(useI18nSync, { initialProps: 'test' });
      const instance = (useTranslation as jest.Mock).mock.results[0].value.i18n;
      await waitFor(() => expect(instance.changeLanguage).not.toHaveBeenCalled());

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

  describe('getLangage function', () => {
    it('should return the prefix if langage is avalaible in monkLangages types package', () => {
      expect(getLanguage('fr-GA')).toEqual('fr');
    });

    it("should return 'en' prefix by default if langage is not found in monkLangages types package", () => {
      expect(getLanguage('au-TEST')).toEqual('en');
    });

    it("should return 'it' if italian is selected", () => {
      expect(getLanguage('it-IT')).toEqual('it');
    });
  });
});
