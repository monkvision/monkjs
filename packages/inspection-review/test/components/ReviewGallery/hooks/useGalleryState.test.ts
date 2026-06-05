import { act, renderHook } from '@testing-library/react';
import { useGalleryState } from '../../../../src/components/ReviewGallery/hooks/useGalleryState';
import { GalleryItem } from '../../../../src/types';

jest.mock('@monkvision/common', () => ({
  useObjectMemo: jest.fn((value) => value),
}));

const createGalleryItem = (overrides: Partial<GalleryItem> = {}): GalleryItem => ({
  image: {
    id: overrides.image?.id ?? 'img-1',
  } as any,
  renderedOutput: undefined,
  hasDamage: false,
  parts: [],
  sight: undefined,
  totalPolygonArea: 0,
  ...overrides,
});

describe('useGalleryState', () => {
  const ITEMS: GalleryItem[] = [
    createGalleryItem({ image: { id: 'img-1' } as any }),
    createGalleryItem({ image: { id: 'img-2' } as any }),
  ];

  it('initializes with no selection', () => {
    const { result } = renderHook(() => useGalleryState({ currentGalleryItems: ITEMS }));

    expect(result.current.selectedItem).toBeNull();
  });

  it('selects item by id', () => {
    const { result } = renderHook(() => useGalleryState({ currentGalleryItems: ITEMS }));

    act(() => {
      result.current.onSelectItemById('img-2');
    });

    expect(result.current.selectedItem?.image.id).toBe('img-2');
  });

  it('clears selection when selecting null', () => {
    const { result } = renderHook(() => useGalleryState({ currentGalleryItems: ITEMS }));

    act(() => {
      result.current.onSelectItemById('img-1');
    });

    act(() => {
      result.current.onSelectItemById(null);
    });

    expect(result.current.selectedItem).toBeNull();
  });

  it('resets selection when selected item is no longer available', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useGalleryState({ currentGalleryItems: items }),
      { initialProps: { items: ITEMS } },
    );

    act(() => {
      result.current.onSelectItemById('img-1');
    });

    rerender({ items: [createGalleryItem({ image: { id: 'img-3' } as any })] });

    expect(result.current.selectedItem).toBeNull();
  });

  it('resetSelectedItem clears selection', () => {
    const { result } = renderHook(() => useGalleryState({ currentGalleryItems: ITEMS }));

    act(() => {
      result.current.onSelectItemById('img-1');
    });

    act(() => {
      result.current.resetSelectedItem();
    });

    expect(result.current.selectedItem).toBeNull();
  });

  it('ignores selection when id not found', () => {
    const { result } = renderHook(() => useGalleryState({ currentGalleryItems: ITEMS }));

    act(() => {
      result.current.onSelectItemById('missing');
    });

    expect(result.current.selectedItem).toBeNull();
  });
});
