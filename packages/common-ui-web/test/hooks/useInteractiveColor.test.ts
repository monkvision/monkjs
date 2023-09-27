import { MouseEvent } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { InteractiveColor, useInteractiveColor } from '../../src';

describe('useInteractiveColor hook', () => {
  const color: InteractiveColor = {
    regular: 'regular',
    hover: 'hover',
    active: 'active',
    disabled: 'disabled',
  };

  it('should return the regular color by default', () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color), {
      initialProps: { color },
    });

    expect(result.current.color).toEqual(color.regular);
    unmount();
  });

  it('should return the hover color on hover', () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color), {
      initialProps: { color },
    });

    act(() => {
      result.current.events.onMouseEnter({} as unknown as MouseEvent);
    });
    waitFor(() => {
      expect(result.current.color).toEqual(color.hover);
    });
    unmount();
  });

  it('should return the active color on press', () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color), {
      initialProps: { color },
    });

    act(() => {
      result.current.events.onMouseDown({} as unknown as MouseEvent);
    });
    waitFor(() => {
      expect(result.current.color).toEqual(color.active);
    });
    act(() => {
      result.current.events.onMouseLeave({} as unknown as MouseEvent);
    });
    waitFor(() => {
      expect(result.current.color).toEqual(color.regular);
    });
    unmount();
  });

  it('should return the active color on press even when hovered', () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color), {
      initialProps: { color },
    });

    act(() => {
      result.current.events.onMouseEnter({} as unknown as MouseEvent);
      result.current.events.onMouseDown({} as unknown as MouseEvent);
    });
    waitFor(() => {
      expect(result.current.color).toEqual(color.active);
    });
    act(() => {
      result.current.events.onMouseUp({} as unknown as MouseEvent);
    });
    waitFor(() => {
      expect(result.current.color).toEqual(color.hover);
    });
    unmount();
  });

  it('should return the disabled color when disabled', () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color, true), {
      initialProps: { color },
    });

    expect(result.current.color).toEqual(color.disabled);
    unmount();
  });

  it('should return the disabled color when disabled even when it is hovered or active', () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color, true), {
      initialProps: { color },
    });

    act(() => {
      result.current.events.onMouseEnter({} as unknown as MouseEvent);
      result.current.events.onMouseDown({} as unknown as MouseEvent);
    });
    waitFor(() => {
      expect(result.current.color).toEqual(color.disabled);
    });
    unmount();
  });
});
