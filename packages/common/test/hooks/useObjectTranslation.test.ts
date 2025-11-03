import { monkLanguages, TranslationObject } from '@monkvision/types';
import { useTranslation } from 'react-i18next';
import { renderHook } from '@testing-library/react-hooks';
import { useObjectTranslation } from '../../src';

const obj = {
  en: 'Hello',
  fr: 'Bonjour',
  de: 'Hallo',
  nl: 'HalloDt',
  it: 'Ciao',
} as TranslationObject;

describe('useObjectTranslation hook', () => {
  it('should return a tObj function', () => {
    const { result, unmount } = renderHook(useObjectTranslation);

    expect(typeof result.current.tObj).toBe('function');
    unmount();
  });

  it('should properly translate ObjectTranslation value', () => {
    const { result, rerender, unmount } = renderHook(useObjectTranslation);
    monkLanguages.forEach((language) => {
      (useTranslation as jest.Mock).mockImplementationOnce(() => ({ i18n: { language } }));
      rerender();
      expect(result.current.tObj(obj)).toBe(obj[language]);
    });

    unmount();
  });

  it('should return a default value when the translation is not found', () => {
    const { result, unmount } = renderHook(useObjectTranslation);
    expect(typeof result.current.tObj({} as TranslationObject)).toBe('string');
    unmount();
  });

  it('should pass the options parameters to the useTranslation hook', () => {
    const ns = 'test-ns';
    const options = { lng: 'nl' };
    const { unmount } = renderHook(() => useObjectTranslation(ns, options));
    expect(useTranslation).toHaveBeenCalledWith(ns, options);

    unmount();
  });
});
