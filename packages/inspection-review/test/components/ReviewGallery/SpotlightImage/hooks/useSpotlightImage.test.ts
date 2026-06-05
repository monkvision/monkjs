import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { useSpotlightImage } from '../../../../../src/components/ReviewGallery/SpotlightImage/hooks/useSpotlightImage';
import { Image } from '@monkvision/types';

jest.mock('@monkvision/common', () => ({
  useMonkState: jest.fn(),
}));

const mockUseMonkState = jest.requireMock('@monkvision/common').useMonkState as jest.Mock;

const RENDERED_PATH = 'rendered.jpg';
const ORIGINAL_PATH = 'original.jpg';
const RENDERED_ID = 'rendered-1';

const createImage = (overrides: Partial<Image> = {}): Image =>
  ({
    id: 'img-1',
    path: ORIGINAL_PATH,
    renderedOutputs: [RENDERED_ID],
    ...overrides,
  } as any);

const renderedOutputs = [
  {
    id: RENDERED_ID,
    path: RENDERED_PATH,
    additionalData: { description: 'rendering of detected damages' },
  },
];

describe('useSpotlightImage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMonkState.mockReturnValue({ state: { renderedOutputs } });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mac OS X',
      configurable: true,
    });
  });

  it('returns rendered output path when showDamage is true', () => {
    const image = createImage();
    const { result } = renderHook(() => useSpotlightImage({ image, showDamage: true }));

    expect(result.current.backgroundImage).toBe(RENDERED_PATH);
  });

  it('returns original path when showDamage is false', () => {
    const image = createImage();
    const { result } = renderHook(() => useSpotlightImage({ image, showDamage: false }));

    expect(result.current.backgroundImage).toBe(ORIGINAL_PATH);
  });

  it('sets cursor style on mouse down/up', () => {
    const image = createImage();
    const { result } = renderHook(() => useSpotlightImage({ image, showDamage: false }));

    act(() => {
      result.current.handleMouseDown();
    });
    expect(result.current.cursorStyle).toBe('grabbing');

    act(() => {
      result.current.handleMouseUp();
    });
    expect(result.current.cursorStyle).toBe('grab');
  });

  it('updates cursor style on meta/ctrl key down/up', () => {
    const image = createImage();
    const { result } = renderHook(() => useSpotlightImage({ image, showDamage: false }));

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { metaKey: true }));
    });
    expect(result.current.cursorStyle).toBe('zoom-in');

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keyup', { metaKey: false }));
    });
    expect(result.current.cursorStyle).toBe('grab');
  });

  it('sets isMouseOver based on mouse move target', () => {
    const image = createImage();
    const { result } = renderHook(() => useSpotlightImage({ image, showDamage: false }));

    const spotlight = document.createElement('div');
    spotlight.className = 'spotlight-image';
    document.body.appendChild(spotlight);

    act(() => {
      spotlight.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    });
    expect(result.current.isMouseOver).toBe(true);

    const other = document.createElement('div');
    document.body.appendChild(other);

    act(() => {
      other.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    });
    expect(result.current.isMouseOver).toBe(false);
  });

  it('resets transform when image changes', () => {
    const resetTransform = jest.fn();
    const refSpy = jest
      .spyOn(React, 'useRef')
      .mockReturnValue({ current: { resetTransform } } as any);

    const { rerender } = renderHook(
      ({ image }) => useSpotlightImage({ image, showDamage: false }),
      { initialProps: { image: createImage({ id: 'img-1' }) } },
    );

    rerender({ image: createImage({ id: 'img-2' }) });

    expect(resetTransform).toHaveBeenCalledWith(0);
    refSpy.mockRestore();
  });
});
