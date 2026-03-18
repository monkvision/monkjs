import { act, renderHook } from '@testing-library/react';
import { useShortcuts } from '../../../../../../src/components/ReviewGallery/SpotlightImage/Shortcuts/hooks/useShortcuts';
import { GalleryItem } from '../../../../../../src';
import { Image } from '@monkvision/types';

jest.mock('@monkvision/common', () => ({
  useObjectMemo: jest.fn((value) => value),
}));

jest.mock('../../../../../../src/hooks', () => ({
  useInspectionReviewProvider: jest.fn(),
}));

const mockUseInspectionReviewProvider = jest.requireMock('../../../../../../src/hooks')
  .useInspectionReviewProvider as jest.Mock;

const createGalleryItem = (id: string): GalleryItem => ({
  image: { id } as Image,
  renderedOutput: undefined,
  hasDamage: false,
  parts: [],
  totalPolygonArea: 0,
});

describe('useShortcuts', () => {
  const onSelectItemById = jest.fn();
  const items: GalleryItem[] = [
    createGalleryItem('img-1'),
    createGalleryItem('img-2'),
    createGalleryItem('img-3'),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseInspectionReviewProvider.mockReturnValue({ currentGalleryItems: items });
  });

  it('toggles showDamage via handler', () => {
    const { result } = renderHook(() => useShortcuts({ selectedItem: items[0], onSelectItemById }));

    expect(result.current.showDamage).toBe(false);

    act(() => {
      result.current.toggleShowDamage();
    });

    expect(result.current.showDamage).toBe(true);
  });

  it('navigates to previous image and wraps from first to last', () => {
    const { result, rerender } = renderHook(
      ({ selectedItem }) => useShortcuts({ selectedItem, onSelectItemById }),
      { initialProps: { selectedItem: items[1] } },
    );

    act(() => {
      result.current.goToPreviousImage();
    });

    expect(onSelectItemById).toHaveBeenCalledWith('img-1');

    rerender({ selectedItem: items[0] });

    act(() => {
      result.current.goToPreviousImage();
    });

    expect(onSelectItemById).toHaveBeenCalledWith('img-3');
  });

  it('navigates to next image and wraps from last to first', () => {
    const { result, rerender } = renderHook(
      ({ selectedItem }) => useShortcuts({ selectedItem, onSelectItemById }),
      { initialProps: { selectedItem: items[2] } },
    );

    act(() => {
      result.current.goToNextImage();
    });

    expect(onSelectItemById).toHaveBeenCalledWith('img-1');

    rerender({ selectedItem: items[1] });

    act(() => {
      result.current.goToNextImage();
    });

    expect(onSelectItemById).toHaveBeenCalledWith('img-3');
  });

  it('dispatches keyboard shortcuts for toggling, navigation, and closing', () => {
    const { result, unmount } = renderHook(() =>
      useShortcuts({ selectedItem: items[0], onSelectItemById }),
    );

    const toggleEvent = new KeyboardEvent('keydown', { key: 's', cancelable: true });
    act(() => {
      window.dispatchEvent(toggleEvent);
    });

    expect(toggleEvent.defaultPrevented).toBe(true);
    expect(result.current.showDamage).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'q' }));
    });

    expect(onSelectItemById).toHaveBeenCalledWith('img-2');
    expect(onSelectItemById).toHaveBeenCalledWith(null);

    unmount();
  });

  it('ignores shortcuts when focused on editable elements', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    const { result, unmount } = renderHook(() =>
      useShortcuts({ selectedItem: items[0], onSelectItemById }),
    );

    act(() => {
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }));
    });

    expect(result.current.showDamage).toBe(false);

    unmount();
    input.remove();
  });
});
