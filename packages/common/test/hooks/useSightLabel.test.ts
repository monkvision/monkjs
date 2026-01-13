jest.mock('../../src/hooks/useObjectTranslation', () => ({
  useObjectTranslation: jest.fn(() => ({ tObj: jest.fn() })),
}));

import { renderHook } from '@testing-library/react';
import { LabelDictionary, Sight, TranslationObject } from '@monkvision/types';
import { useObjectTranslation, useSightLabel } from '../../src';

const labels = {
  'rear-back': { key: 'rear-back', en: 'english translation' },
} as unknown as LabelDictionary;

describe('useSightLabel hook', () => {
  it('should return a label function', () => {
    const { result, unmount } = renderHook(() => useSightLabel({ labels }));

    expect(typeof result.current.label).toBe('function');
    unmount();
  });

  it('should properly translate Sight', () => {
    const { result, unmount } = renderHook(() => useSightLabel({ labels }));

    const sight = { id: 'id', label: 'rear-back' } as unknown as Sight;
    expect(useObjectTranslation).toHaveBeenCalled();
    const { tObj } = (useObjectTranslation as jest.Mock).mock.results[0].value;
    const myValue = { en: 'english translation', fr: 'fr', de: 'de' } as TranslationObject;

    expect(result.current.label(sight)).toBe(tObj(myValue));

    unmount();
  });

  it('should return a default value when the translation is not found', () => {
    const { result, unmount } = renderHook(() => useSightLabel({ labels }));

    const sight = {} as unknown as Sight;

    expect(typeof result.current.label(sight)).toBe('string');

    unmount();
  });
});
