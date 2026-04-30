import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useObjectMemo,
  normalizeAngle,
  getAngleDifference,
  angleToSegment,
} from '@monkvision/common';
import { DEGREE_GRANULARITY } from '@monkvision/common-ui-web';

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
   * The current position of the user around the vehicle (between 0 and 360).
   */
  walkaroundPosition: number;
  /**
   * Percentage of the walkaround completed.
   */
  coveragePercentage: number;
}

const TOTAL_SEGMENTS = 360 / DEGREE_GRANULARITY;
const SMOOTHING_FACTOR = 0.3;
const STABILIZATION_THRESHOLD_DEGREES = 30;
const STABILIZATION_FRAMES = 3;

/**
 * Custom hook used to manage the vehicle walkaround tracking.
 */
export function useVehicleWalkaround({
  alpha,
}: UseVehicleWalkaroundParams): VehicleWalkaroundHandle {
  const [startingAlpha, setStartingAlpha] = useState<number | null>(null);
  const [coveredSegments, setCoveredSegments] = useState<Set<number>>(new Set());
  const smoothedAlphaRef = useRef<number | null>(null);
  const prevStartingAlphaRef = useRef<number | null>(null);
  const stableFramesCountRef = useRef(0);
  const isStabilizedRef = useRef(false);

  if (prevStartingAlphaRef.current !== startingAlpha) {
    smoothedAlphaRef.current = null;
    prevStartingAlphaRef.current = startingAlpha;
    stableFramesCountRef.current = 0;
    isStabilizedRef.current = false;
  }

  useEffect(() => {
    if (prevStartingAlphaRef.current === startingAlpha && startingAlpha !== null) {
      const newSegments = new Set<number>();
      newSegments.add(0);
      setCoveredSegments(newSegments);
    }
  }, [startingAlpha]);

  const smoothedAlpha = useMemo(() => {
    if (startingAlpha === null) {
      smoothedAlphaRef.current = null;
      return alpha;
    }

    if (smoothedAlphaRef.current === null) {
      smoothedAlphaRef.current = alpha;
      return alpha;
    }

    const diff = getAngleDifference(alpha, smoothedAlphaRef.current);

    if (!isStabilizedRef.current) {
      if (Math.abs(diff) < STABILIZATION_THRESHOLD_DEGREES) {
        stableFramesCountRef.current += 1;

        if (stableFramesCountRef.current >= STABILIZATION_FRAMES) {
          isStabilizedRef.current = true;
          smoothedAlphaRef.current = startingAlpha;
          return startingAlpha;
        }
      } else {
        stableFramesCountRef.current = 0;
      }

      smoothedAlphaRef.current = normalizeAngle(smoothedAlphaRef.current + diff * 0.1);
      return smoothedAlphaRef.current;
    }

    smoothedAlphaRef.current = normalizeAngle(smoothedAlphaRef.current + diff * SMOOTHING_FACTOR);
    return smoothedAlphaRef.current;
  }, [alpha, startingAlpha]);

  const walkaroundPosition = useMemo(() => {
    if (startingAlpha === null) {
      return 0;
    }
    let diff = startingAlpha - smoothedAlpha;
    if (diff < 0) {
      diff += 360;
    }
    return normalizeAngle(diff);
  }, [startingAlpha, smoothedAlpha]);

  useEffect(() => {
    if (startingAlpha !== null && isStabilizedRef.current) {
      const segment = angleToSegment(walkaroundPosition, DEGREE_GRANULARITY);

      if (!coveredSegments.has(segment)) {
        setCoveredSegments((prev) => new Set(prev).add(segment));
      }
    }
  }, [walkaroundPosition, startingAlpha, coveredSegments]);

  const coveragePercentage = useMemo(
    () => (coveredSegments.size / TOTAL_SEGMENTS) * 100,
    [coveredSegments],
  );

  const startWalkaround = useCallback(() => {
    setStartingAlpha(alpha);
  }, [alpha]);

  return useObjectMemo({
    startWalkaround,
    walkaroundPosition,
    coveragePercentage,
  });
}
