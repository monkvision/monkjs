import { renderHook } from '@testing-library/react-hooks';
import { useTranslation } from 'react-i18next';
import { useLangProp } from '../../src/hooks/useLangProp';
import { useMonitoring } from '@monkvision/monitoring';
import { waitFor } from '@testing-library/react';

function getChangeLanguage(): jest.Mock {
  expect(useTranslation).toHaveBeenCalled();
  const lastCall = (useTranslation as jest.Mock).mock.results.length - 1;
  return (useTranslation as jest.Mock).mock.results[lastCall].value.i18n
    .changeLanguage as jest.Mock;
}

describe('useLangProp hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update the language on the first render', () => {
    const lang = 'fr';
    const { unmount } = renderHook(useLangProp, { initialProps: lang });

    expect(getChangeLanguage()).toHaveBeenCalledWith(lang);

    unmount();
  });

  it('should change the language everytime the lang param changes', () => {
    let lang = 'fr';
    const { rerender, unmount } = renderHook(useLangProp, { initialProps: lang });

    expect(getChangeLanguage()).toHaveBeenCalledWith(lang);

    lang = 'en';
    expect(getChangeLanguage()).not.toHaveBeenCalledWith(lang);
    rerender(lang);
    expect(getChangeLanguage()).toHaveBeenCalledWith(lang);

    unmount();
  });

  it('should not change the language if the lang parameter is not provided', () => {
    const { unmount } = renderHook(useLangProp);

    expect(getChangeLanguage()).not.toHaveBeenCalled();

    unmount();
  });

  it('should call handleError if the changeLanguage call fails', async () => {
    const err = 'test-salut';
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({
      i18n: { changeLanguage: jest.fn(() => Promise.reject(err)) },
    }));
    const { unmount } = renderHook(useLangProp, { initialProps: 'fr' });

    expect(useMonitoring).toHaveBeenCalled();
    const { handleError } = (useMonitoring as jest.Mock).mock.results[0].value;
    await waitFor(() => {
      expect(handleError).toHaveBeenCalledWith(err);
    });

    unmount();
  });

  it('should throw an error if the given language is not supported', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { result, unmount } = renderHook(useLangProp, { initialProps: 'unknown-lang' });

    expect(result.error).toBeDefined();

    unmount();
    jest.spyOn(console, 'error').mockRestore();
  });
});
