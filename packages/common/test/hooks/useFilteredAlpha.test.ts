import { act, renderHook } from '@testing-library/react';
import { useFilteredAlpha } from '../../src/hooks/useFilteredAlpha';

describe('useFilteredAlpha hook', () => {
  it('should return a handle with getFilteredAlpha function', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    expect(result.current).toHaveProperty('getFilteredAlpha');
    expect(typeof result.current.getFilteredAlpha).toBe('function');

    unmount();
  });

  it('should return the initial alpha value when called for the first time', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    act(() => {
      const filtered = result.current.getFilteredAlpha(45);
      expect(filtered).toBe(45);
    });

    unmount();
  });

  it('should return the new alpha value when there is a normal change', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    act(() => {
      result.current.getFilteredAlpha(100);
    });

    act(() => {
      const filtered = result.current.getFilteredAlpha(120);
      expect(filtered).toBe(120);
    });

    unmount();
  });

  it('should filter out anomalous jumps greater than MAX_ALPHA_JUMP (50 degrees)', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    act(() => {
      result.current.getFilteredAlpha(100);
    });

    act(() => {
      const filtered = result.current.getFilteredAlpha(200);
      expect(filtered).toBe(100);
    });

    unmount();
  });

  it('should filter out when alpha becomes 0 from a non-zero value', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    act(() => {
      result.current.getFilteredAlpha(150);
    });

    act(() => {
      const filtered = result.current.getFilteredAlpha(0);
      expect(filtered).toBe(150);
    });

    unmount();
  });

  it('should handle alpha changes near the 0/360 boundary correctly', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    act(() => {
      result.current.getFilteredAlpha(350);
    });

    act(() => {
      const filtered = result.current.getFilteredAlpha(10);
      expect(filtered).toBe(10);
    });

    unmount();
  });

  it('should filter consecutive anomalous jumps', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    act(() => {
      result.current.getFilteredAlpha(100);
    });

    act(() => {
      const filtered1 = result.current.getFilteredAlpha(200);
      expect(filtered1).toBe(100);
    });

    act(() => {
      const filtered2 = result.current.getFilteredAlpha(300);
      expect(filtered2).toBe(100);
    });

    unmount();
  });

  it('should accept valid changes after filtering an anomalous jump', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    act(() => {
      result.current.getFilteredAlpha(100);
    });

    act(() => {
      result.current.getFilteredAlpha(200);
    });

    act(() => {
      const filtered = result.current.getFilteredAlpha(220);
      expect(filtered).toBe(220);
    });

    unmount();
  });

  it('should allow small incremental changes that sum to more than MAX_ALPHA_JUMP', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    let currentAlpha = 0;

    act(() => {
      result.current.getFilteredAlpha(currentAlpha);
    });

    for (let i = 0; i < 10; i++) {
      currentAlpha += 20;
      const expectedAlpha = currentAlpha;
      act(() => {
        const filtered = result.current.getFilteredAlpha(expectedAlpha);
        expect(filtered).toBe(expectedAlpha);
      });
    }

    expect(currentAlpha).toBe(200);

    unmount();
  });

  it('should maintain state across multiple calls', () => {
    const { result, unmount } = renderHook(useFilteredAlpha);

    const alphaValues = [50, 60, 70, 65, 80];
    const expected = [50, 60, 70, 65, 80];

    alphaValues.forEach((alpha, index) => {
      act(() => {
        const filtered = result.current.getFilteredAlpha(alpha);
        expect(filtered).toBe(expected[index]);
      });
    });

    unmount();
  });

  it('should handle the getFilteredAlpha callback being stable (memoized)', () => {
    const { result, rerender, unmount } = renderHook(useFilteredAlpha);

    const firstCallback = result.current.getFilteredAlpha;

    rerender();

    const secondCallback = result.current.getFilteredAlpha;

    expect(firstCallback).toBe(secondCallback);

    unmount();
  });
});
