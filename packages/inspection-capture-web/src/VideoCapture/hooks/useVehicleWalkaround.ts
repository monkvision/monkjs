import { useCallback, useEffect, useMemo, useState } from 'react';
import { angleToSegment, normalizeAngle, useObjectMemo } from '@monkvision/common';
import { DEGREE_GRANULARITY } from '@monkvision/common-ui-web';

const TOTAL_SEGMENTS = 360 / DEGREE_GRANULARITY;

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
 * Handle returned by the useVehicleWalkaround hook to manage the VehicleWalkaround feature.
 */
export interface VehicleWalkaroundHandle {
  /**
   * Callback called at the start of the recording, to set the initial alpha position of the user.
   */
  startWalkaround: () => void;
  /**
   * The current angular position of the user relative to start (between 0 and 360).
   */
  walkaroundPosition: number;
  /**
   * Percentage of the walkaround completed.
   */
  coveragePercentage: number;
}

/**
 * Custom hook used to manage the vehicle walkaround tracking.
 */
export function useVehicleWalkaround({
  alpha,
}: UseVehicleWalkaroundParams): VehicleWalkaroundHandle {
  const [startingAlpha, setStartingAlpha] = useState<number | null>(null);
  const [coveredSegments, setCoveredSegments] = useState<Set<number>>(new Set());

  const walkaroundPosition = useMemo(() => {
    if (startingAlpha === null) {
      return 0;
    }
    const diff = startingAlpha - alpha;
    return normalizeAngle(diff);
  }, [startingAlpha, alpha]);

  useEffect(() => {
    if (startingAlpha !== null) {
      const currentSegment = angleToSegment(walkaroundPosition, DEGREE_GRANULARITY);
      if (!coveredSegments.has(currentSegment)) {
        setCoveredSegments((prev) => new Set(prev).add(currentSegment));
      }
    }
  }, [walkaroundPosition, startingAlpha]);

  const coveragePercentage = useMemo(() => {
    return (coveredSegments.size / TOTAL_SEGMENTS) * 100;
  }, [coveredSegments]);

  const startWalkaround = useCallback(() => {
    setStartingAlpha(alpha);
    setCoveredSegments(new Set([0]));
  }, [alpha]);

  return useObjectMemo({ startWalkaround, walkaroundPosition, coveragePercentage });
}
