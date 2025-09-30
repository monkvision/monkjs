import { renderHook, act } from '@testing-library/react';
import { useSafeTimeout } from '../../src';

jest.useFakeTimers();

describe('useSafeTimeout hook', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should execute callback after specified delay', () => {
    const { result } = renderHook(() => useSafeTimeout());
    const callback = jest.fn();

    act(() => {
      result.current(callback, 1000);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not execute callback if component unmounts before delay', () => {
    const { result, unmount } = renderHook(() => useSafeTimeout());
    const callback = jest.fn();

    act(() => {
      result.current(callback, 1000);
    });

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should allow multiple timeouts to run if not overridden', () => {
    const { result } = renderHook(() => useSafeTimeout());
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    act(() => {
      result.current(callback1, 1000);
    });

    act(() => {
      result.current(callback2, 500);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback1).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple timeouts in sequence', () => {
    const { result } = renderHook(() => useSafeTimeout());
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    act(() => {
      result.current(callback1, 500);
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback1).toHaveBeenCalledTimes(1);

    act(() => {
      result.current(callback2, 300);
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should handle zero delay', () => {
    const { result } = renderHook(() => useSafeTimeout());
    const callback = jest.fn();

    act(() => {
      result.current(callback, 0);
    });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clean up timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { result, unmount } = renderHook(() => useSafeTimeout());
    const callback = jest.fn();

    act(() => {
      result.current(callback, 1000);
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('should return the same function reference across renders', () => {
    const { result, rerender } = renderHook(() => useSafeTimeout());
    const firstReference = result.current;

    rerender();
    const secondReference = result.current;

    expect(firstReference).toBe(secondReference);
  });

  it('should handle callback that throws an error', () => {
    const { result } = renderHook(() => useSafeTimeout());
    const errorCallback = jest.fn(() => {
      throw new Error('Test error');
    });

    act(() => {
      result.current(errorCallback, 100);
    });

    expect(() => {
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }).toThrow('Test error');

    expect(errorCallback).toHaveBeenCalledTimes(1);
  });
});
