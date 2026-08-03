import { act, renderHook } from '@testing-library/react';
import { useZoomPan } from '../../../../../src/components/ReviewGallery/SpotlightImage/hooks/useZoomPan';

describe('useZoomPan hook', () => {
  it('returns the expected initial state', () => {
    const { result } = renderHook(() => useZoomPan({ activationKeys: ['Meta'] }));

    expect(result.current.isPanning).toBe(false);
    expect(result.current.wrapperRef.current).toBeNull();
    expect(result.current.contentRef.current).toBeNull();
    expect(result.current.contentStyle).toEqual({
      transform: 'translate(0px, 0px) scale(1)',
      transformOrigin: '0 0',
    });
  });

  it('toggles isPanning and calls onPanStart/onPanEnd on pointer down/up', () => {
    const onPanStart = jest.fn();
    const onPanEnd = jest.fn();
    const { result } = renderHook(() => useZoomPan({ activationKeys: ['Meta'], onPanStart, onPanEnd }));

    const setPointerCapture = jest.fn();
    const releasePointerCapture = jest.fn();
    const pointerEvent = {
      clientX: 0,
      clientY: 0,
      pointerId: 1,
      currentTarget: { setPointerCapture, releasePointerCapture },
    } as any;

    act(() => {
      result.current.onPointerDown(pointerEvent);
    });

    expect(result.current.isPanning).toBe(true);
    expect(onPanStart).toHaveBeenCalledTimes(1);
    expect(setPointerCapture).toHaveBeenCalledWith(1);

    act(() => {
      result.current.onPointerUp(pointerEvent);
    });

    expect(result.current.isPanning).toBe(false);
    expect(onPanEnd).toHaveBeenCalledTimes(1);
    expect(releasePointerCapture).toHaveBeenCalledWith(1);
  });

  it('does nothing on pointer move/up when no pan is in progress', () => {
    const { result } = renderHook(() => useZoomPan({ activationKeys: ['Meta'] }));

    const pointerEvent = {
      clientX: 10,
      clientY: 10,
      pointerId: 1,
      currentTarget: { setPointerCapture: jest.fn(), releasePointerCapture: jest.fn() },
    } as any;

    act(() => {
      result.current.onPointerMove(pointerEvent);
      result.current.onPointerUp(pointerEvent);
    });

    expect(result.current.isPanning).toBe(false);
    expect(result.current.contentStyle).toEqual({
      transform: 'translate(0px, 0px) scale(1)',
      transformOrigin: '0 0',
    });
  });

  it('resets scale and position back to their initial values', () => {
    const { result } = renderHook(() => useZoomPan({ activationKeys: ['Meta'], minScale: 2 }));

    act(() => {
      result.current.reset();
    });

    expect(result.current.contentStyle).toEqual({
      transform: 'translate(0px, 0px) scale(2)',
      transformOrigin: '0 0',
    });
  });
});
