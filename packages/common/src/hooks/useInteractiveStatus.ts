import { MouseEventHandler, useCallback, useMemo, useState, MouseEvent } from 'react';
import { InteractiveStatus } from '@monkvision/types';

/**
 * Object containing the event listeners used to get the current status of an interactive element.
 */
export interface InteractiveEventListeners {
  onMouseEnter: MouseEventHandler;
  onMouseLeave: MouseEventHandler;
  onMouseDown: MouseEventHandler;
  onMouseUp: MouseEventHandler;
}

/**
 * Parameters given to the useInteractiveStatus hook.
 */
export interface UseInteractiveStatusParams {
  /**
   * Boolean indicating if the element is disabled or not.
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * The event handlers of the component if you need to merge them.
   */
  componentHandlers?: Partial<InteractiveEventListeners>;
}

/**
 * The result of the useInteractiveStatus. It contains the current interactive status of the element as well as the
 * event listeners it needs to update its status.
 */
export interface UseInteractiveStatusResult {
  /**
   * The interactive status of the element.
   */
  status: InteractiveStatus;
  /**
   * The event listeners the element needs to update its status.
   */
  eventHandlers: InteractiveEventListeners;
}

interface InteractiveProperties {
  hovered?: boolean;
  active?: boolean;
  disabled?: boolean;
}

function getInteractiveStatus({
  hovered = false,
  active = false,
  disabled = false,
}: InteractiveProperties): InteractiveStatus {
  if (disabled) {
    return InteractiveStatus.DISABLED;
  }
  if (active) {
    return InteractiveStatus.ACTIVE;
  }
  return hovered ? InteractiveStatus.HOVERED : InteractiveStatus.DEFAULT;
}

/**
 * Custom hook used to manage the interactive state (active, hovered, disabled...) of a React element. This hook returns
 * the state of the element, as well as MouseEvent listeners needed on the element to update its interactive state.
 *
 * @example
 * function TestComponent() {
 *   const { status, events } = useInteractiveStatus();
 *   useEffect(() => console.log('Button status :', status), [status]);
 *   return <button {...events}>My Button</button>;
 * }
 */
export function useInteractiveStatus(
  params?: UseInteractiveStatusParams,
): UseInteractiveStatusResult {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const onMouseEnter = useCallback(
    (event: MouseEvent) => {
      setHovered(true);
      if (params?.componentHandlers?.onMouseEnter) {
        params.componentHandlers.onMouseEnter(event);
      }
    },
    [params?.componentHandlers?.onMouseEnter],
  );

  const onMouseLeave = useCallback(
    (event: MouseEvent) => {
      setHovered(false);
      if (params?.componentHandlers?.onMouseLeave) {
        params.componentHandlers.onMouseLeave(event);
      }
    },
    [params?.componentHandlers?.onMouseLeave],
  );

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      setActive(true);
      if (params?.componentHandlers?.onMouseDown) {
        params.componentHandlers.onMouseDown(event);
      }
    },
    [params?.componentHandlers?.onMouseDown],
  );

  const onMouseUp = useCallback(
    (event: MouseEvent) => {
      setActive(false);
      if (params?.componentHandlers?.onMouseUp) {
        params.componentHandlers.onMouseUp(event);
      }
    },
    [params?.componentHandlers?.onMouseUp],
  );

  return useMemo(
    () => ({
      status: getInteractiveStatus({ hovered, active, disabled: params?.disabled }),
      eventHandlers: {
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onMouseUp,
      },
    }),
    [hovered, active, params?.disabled, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp],
  );
}
