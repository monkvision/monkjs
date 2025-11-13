import { resizeWindow } from '@monkvision/test-utils';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useWindowDimensions } from '../../src';

describe('useWindowSize hook', () => {
  it('should return the width and height when a resize event is fired', () => {
    const { result, unmount } = renderHook(useWindowDimensions);
    const innerWidth = 444;
    const innerHeight = 666;
    act(() => {
      resizeWindow({ innerWidth, innerHeight });
    });
    expect(result.current).not.toBeNull();
    expect(result.current?.width).toEqual(innerWidth);
    expect(result.current?.height).toEqual(innerHeight);
    unmount();
  });

  it('should return the window orientation when a resize event is fired', () => {
    const { result, unmount } = renderHook(useWindowDimensions);
    act(() => {
      resizeWindow({ innerWidth: 111, innerHeight: 999 });
    });
    expect(result.current).not.toBeNull();
    expect(result.current?.isPortrait).toEqual(true);
    act(() => {
      resizeWindow({ innerWidth: 999, innerHeight: 111 });
    });
    expect(result.current).not.toBeNull();
    expect(result.current?.isPortrait).toEqual(false);
    unmount();
  });
});
