import { MouseEvent } from 'react';
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
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

  it('should return the hover color on hover', async () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color), {
      initialProps: { color },
    });

    act(() => {
      result.current.events.onMouseEnter({} as unknown as MouseEvent);
    });
    await waitFor(() => {
      expect(result.current.color).toEqual(color.hover);
    });
    unmount();
  });

  it('should return the active color on press', async () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color), {
      initialProps: { color },
    });

    act(() => {
      result.current.events.onMouseDown({} as unknown as MouseEvent);
    });
    await waitFor(() => {
      expect(result.current.color).toEqual(color.active);
    });
    act(() => {
      result.current.events.onMouseUp({} as unknown as MouseEvent);
    });
    await waitFor(() => {
      expect(result.current.color).toEqual(color.regular);
    });
    unmount();
  });

  it('should return the active color on press even when hovered', async () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color), {
      initialProps: { color },
    });

    act(() => {
      result.current.events.onMouseEnter({} as unknown as MouseEvent);
      result.current.events.onMouseDown({} as unknown as MouseEvent);
    });
    await waitFor(() => {
      expect(result.current.color).toEqual(color.active);
    });
    act(() => {
      result.current.events.onMouseUp({} as unknown as MouseEvent);
    });
    await waitFor(() => {
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

  it('should return the disabled color when disabled even when it is hovered or active', async () => {
    const { result, unmount } = renderHook((props) => useInteractiveColor(props.color, true), {
      initialProps: { color },
    });

    act(() => {
      result.current.events.onMouseEnter({} as unknown as MouseEvent);
      result.current.events.onMouseDown({} as unknown as MouseEvent);
    });
    await waitFor(() => {
      expect(result.current.color).toEqual(color.disabled);
    });
    unmount();
  });
});
