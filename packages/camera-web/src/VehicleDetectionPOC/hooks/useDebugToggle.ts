import { useCallback, useRef, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { DEBUG_TOGGLE_TAP_COUNT, DEBUG_TOGGLE_TAP_DELAY_MS } from '../constants';

/**
 * The handle returned by the useDebugToggle hook.
 */
export interface DebugToggleHandle {
  /**
   * Whether debug mode is currently enabled.
   */
  isDebugEnabled: boolean;
  /**
   * Click handler to attach to the hidden hotspot.
   */
  onHotspotClick: () => void;
}

/**
 * Custom hook implementing the hidden debug mode toggle : tapping the hotspot three times in quick succession flips
 * debug mode on or off, so that QA can inspect why the state machine is behaving the way it is without a rebuild.
 *
 * @param initialValue Whether debug mode starts enabled.
 */
export function useDebugToggle(initialValue = false): DebugToggleHandle {
  const [isDebugEnabled, setIsDebugEnabled] = useState(initialValue);
  const tapCountRef = useRef(0);
  const lastTapAtRef = useRef(0);

  const onHotspotClick = useCallback(() => {
    const now = Date.now();
    tapCountRef.current =
      now - lastTapAtRef.current > DEBUG_TOGGLE_TAP_DELAY_MS ? 1 : tapCountRef.current + 1;
    lastTapAtRef.current = now;

    if (tapCountRef.current >= DEBUG_TOGGLE_TAP_COUNT) {
      tapCountRef.current = 0;
      setIsDebugEnabled((enabled) => !enabled);
    }
  }, []);

  return useObjectMemo({ isDebugEnabled, onHotspotClick });
}
