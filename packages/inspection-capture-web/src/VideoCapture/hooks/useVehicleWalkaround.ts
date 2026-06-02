import { useCallback, useEffect, useMemo, useState } from 'react';
import { angleToSegment, normalizeAngle, useObjectMemo } from '@monkvision/common';

const DEGREE_GRANULARITY = 5;
const TOTAL_SEGMENTS = 360 / DEGREE_GRANULARITY;

/**
 * Params passed to the useVehicleWalkaround hook.
 */
export interface UseVehicleWalkaroundParams {
  /**
   * The alpha value of the device orientation.
   */
  alpha: number;
  /**
   * Whether video recording is currently active (not paused).
   */
  isRecording: boolean;
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
  /**
   * Granularity (in degrees) used for segment tracking.
   */
  degreeGranularity: number;
}

/**
 * Custom hook used to manage the vehicle walkaround tracking.
 */
export function useVehicleWalkaround({
  alpha,
  isRecording,
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
    if (startingAlpha !== null && isRecording) {
      const currentSegment = angleToSegment(walkaroundPosition, DEGREE_GRANULARITY);
      if (!coveredSegments.has(currentSegment)) {
        setCoveredSegments((prev) => new Set(prev).add(currentSegment));
      }
    }
  }, [walkaroundPosition, startingAlpha, isRecording]);

  const coveragePercentage = useMemo(() => {
    return (coveredSegments.size / TOTAL_SEGMENTS) * 100;
  }, [coveredSegments]);

  const startWalkaround = useCallback(() => {
    setStartingAlpha(alpha);
    setCoveredSegments(new Set([0]));
  }, [alpha]);

  return useObjectMemo({
    startWalkaround,
    walkaroundPosition,
    coveragePercentage,
    degreeGranularity: DEGREE_GRANULARITY,
  });
}
