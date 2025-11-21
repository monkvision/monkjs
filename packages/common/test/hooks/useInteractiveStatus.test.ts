import { InteractiveStatus } from '@monkvision/types';
import { MouseEvent } from 'react';
import { act, renderHook } from '@testing-library/react';
import { useInteractiveStatus } from '../../src';

describe('useInteractiveStatus hook', () => {
  it('should return a list of event handlers', () => {
    const { result, unmount } = renderHook(useInteractiveStatus);

    expect(typeof result.current.eventHandlers.onMouseDown).toBe('function');
    expect(typeof result.current.eventHandlers.onMouseUp).toBe('function');
    expect(typeof result.current.eventHandlers.onMouseEnter).toBe('function');
    expect(typeof result.current.eventHandlers.onMouseLeave).toBe('function');
    unmount();
  });

  it('should return the default status by default', () => {
    const { result, unmount } = renderHook(useInteractiveStatus);

    expect(result.current.status).toEqual(InteractiveStatus.DEFAULT);
    unmount();
  });

  it('should return the hovered status while it is hovered', () => {
    const { result, unmount } = renderHook(useInteractiveStatus);

    expect(result.current.status).toEqual(InteractiveStatus.DEFAULT);
    act(() => {
      result.current.eventHandlers.onMouseEnter({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.HOVERED);
    act(() => {
      result.current.eventHandlers.onMouseLeave({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.DEFAULT);

    unmount();
  });

  it('should return the active status while it is clicked', () => {
    const { result, unmount } = renderHook(useInteractiveStatus);

    expect(result.current.status).toEqual(InteractiveStatus.DEFAULT);
    act(() => {
      result.current.eventHandlers.onMouseEnter({} as unknown as MouseEvent);
      result.current.eventHandlers.onMouseDown({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.ACTIVE);
    act(() => {
      result.current.eventHandlers.onMouseLeave({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.ACTIVE);
    act(() => {
      result.current.eventHandlers.onMouseUp({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.DEFAULT);

    unmount();
  });

  it('should return the disabled status while it is disabled even when interacted with', () => {
    const { result, unmount } = renderHook(useInteractiveStatus, {
      initialProps: { disabled: true },
    });

    expect(result.current.status).toEqual(InteractiveStatus.DISABLED);
    act(() => {
      result.current.eventHandlers.onMouseEnter({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.DISABLED);
    act(() => {
      result.current.eventHandlers.onMouseDown({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.DISABLED);
    act(() => {
      result.current.eventHandlers.onMouseUp({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.DISABLED);
    act(() => {
      result.current.eventHandlers.onMouseLeave({} as unknown as MouseEvent);
    });
    expect(result.current.status).toEqual(InteractiveStatus.DISABLED);
    unmount();
  });

  it('should call the component event handlers if provided', () => {
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const onMouseDown = jest.fn();
    const onMouseUp = jest.fn();
    const { result, unmount } = renderHook(useInteractiveStatus, {
      initialProps: {
        componentHandlers: {
          onMouseEnter,
          onMouseLeave,
          onMouseDown,
          onMouseUp,
        },
      },
    });

    const mouseEnter = {} as unknown as MouseEvent;
    const mouseDown = {} as unknown as MouseEvent;
    const mouseUp = {} as unknown as MouseEvent;
    const mouseLeave = {} as unknown as MouseEvent;
    act(() => {
      result.current.eventHandlers.onMouseEnter(mouseEnter);
      result.current.eventHandlers.onMouseDown(mouseDown);
      result.current.eventHandlers.onMouseUp(mouseUp);
      result.current.eventHandlers.onMouseLeave(mouseLeave);
    });
    expect(onMouseEnter).toHaveBeenCalledWith(mouseEnter);
    expect(onMouseDown).toHaveBeenCalledWith(mouseDown);
    expect(onMouseUp).toHaveBeenCalledWith(mouseUp);
    expect(onMouseLeave).toHaveBeenCalledWith(mouseLeave);
    unmount();
  });
});
