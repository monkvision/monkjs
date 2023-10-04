import { MouseEventHandler, useCallback, useMemo, useState } from 'react';

export interface InteractiveColor {
  regular: string;
  hover: string;
  active: string;
  disabled: string;
}

export interface UseInteractiveColorResult {
  color: string;
  events: {
    onMouseEnter: MouseEventHandler;
    onMouseLeave: MouseEventHandler;
    onMouseDown: MouseEventHandler;
    onMouseUp: MouseEventHandler;
  };
}

export function useInteractiveColor(
  interactiveColor: InteractiveColor,
  disabled = false,
): UseInteractiveColorResult {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const onMouseEnter = useCallback(() => setIsHovered(true), []);
  const onMouseLeave = useCallback(() => setIsHovered(false), []);
  const onMouseDown = useCallback(() => setIsActive(true), []);
  const onMouseUp = useCallback(() => setIsActive(false), []);

  const color = useMemo(() => {
    if (disabled) {
      return interactiveColor.disabled;
    }
    if (isActive) {
      return interactiveColor.active;
    }
    return isHovered ? interactiveColor.hover : interactiveColor.regular;
  }, [interactiveColor, disabled, isActive, isHovered]);

  return {
    color,
    events: {
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
    },
  };
}
