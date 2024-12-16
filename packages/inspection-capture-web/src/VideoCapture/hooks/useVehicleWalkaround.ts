import { useCallback, useEffect, useMemo, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';

/**
 * Params passed to the useVehicleWalkaround hook.
 */
export interface UseVehicleWalkaroundParams {
  /**
   * The alpha value of the device orientation.
   */
  alpha: number;
}

/**
 * Custom hook used to manage the vehicle walkaround tracking.
 */
export function useVehicleWalkaround({ alpha }: UseVehicleWalkaroundParams) {
  const [startingAlpha, setStartingAlpha] = useState<number | null>(null);
  const [checkpoint, setCheckpoint] = useState(45);
  const [nextCheckpoint, setNextCheckpoint] = useState(90);

  const walkaroundPosition = useMemo(() => {
    if (!startingAlpha) {
      return 0;
    }
    const diff = startingAlpha - alpha;
    const position = diff < 0 ? 360 + diff : diff;
    return position <= nextCheckpoint ? position : 0;
  }, [startingAlpha, alpha, nextCheckpoint]);

  const startWalkaround = useCallback(() => {
    setStartingAlpha(alpha);
  }, [alpha]);

  useEffect(() => {
    if (walkaroundPosition >= checkpoint) {
      setCheckpoint(nextCheckpoint);
      setNextCheckpoint((value) => value + 45);
    }
  }, [walkaroundPosition, checkpoint, nextCheckpoint]);

  return useObjectMemo({ startWalkaround, walkaroundPosition });
}
