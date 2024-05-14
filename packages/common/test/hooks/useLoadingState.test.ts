import { renderHook } from '@testing-library/react-hooks';
import { useLoadingState } from '../../src';
import { act } from '@testing-library/react';

describe('useLoadingState hook', () => {
  it('should not starts by loading by default', () => {
    const { result, unmount } = renderHook(useLoadingState);
    expect(result.current.isLoading).toBe(false);
    unmount();
  });

  it('should start by loading if asked to', () => {
    const { result, unmount } = renderHook(useLoadingState, { initialProps: true });
    expect(result.current.isLoading).toBe(true);
    unmount();
  });

  it('should not start by loading if not asked to', () => {
    const { result, unmount } = renderHook(useLoadingState, { initialProps: false });
    expect(result.current.isLoading).toBe(false);
    unmount();
  });

  it('should not be in error initially', () => {
    const { result, unmount } = renderHook(useLoadingState);
    expect(result.current.error).toBe(null);
    unmount();
  });

  it('should start loading when the start function is called', () => {
    const { result, unmount } = renderHook(useLoadingState);
    expect(result.current.isLoading).toBe(false);
    act(() => {
      result.current.start();
    });
    expect(result.current.isLoading).toBe(true);
    unmount();
  });

  it('should stop loading with no error when the onSuccess function is called', () => {
    const { result, unmount } = renderHook(useLoadingState);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    act(() => {
      result.current.start();
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    act(() => {
      result.current.onSuccess();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    unmount();
  });

  it('should stop loading with an error when the onError function is called', () => {
    const { result, unmount } = renderHook(useLoadingState);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    act(() => {
      result.current.start();
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
    const error = 23;
    act(() => {
      result.current.onError(error);
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(error);
    unmount();
  });

  it('should reset the errror status when the start function is called', () => {
    const { result, unmount } = renderHook(useLoadingState);
    expect(result.current.error).toBe(null);
    act(() => {
      result.current.onError();
    });
    expect(result.current.error).not.toBe(null);
    act(() => {
      result.current.start();
    });
    expect(result.current.error).toBe(null);
    unmount();
  });
});
