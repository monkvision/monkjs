import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeAngle, useObjectMemo } from '@monkvision/common';
import { CoveredSegment } from '@monkvision/common-ui-web';

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
   * Covered segments as angle ranges.
   */
  coveredSegments: CoveredSegment[];
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
      const currentSegment = Math.floor(walkaroundPosition / DEGREE_GRANULARITY) % TOTAL_SEGMENTS;
      if (!coveredSegments.has(currentSegment)) {
        setCoveredSegments((prev) => new Set(prev).add(currentSegment));
      }
    }
  }, [walkaroundPosition, startingAlpha, isRecording]);

  const coveragePercentage = useMemo(() => {
    return (coveredSegments.size / TOTAL_SEGMENTS) * 100;
  }, [coveredSegments]);

  const coveredSegmentRanges = useMemo((): CoveredSegment[] => {
    if (coveredSegments.size === 0) {
      return [];
    }
    const sorted = Array.from(coveredSegments).sort((a, b) => a - b);
    const ranges: CoveredSegment[] = [];
    let rangeStart = sorted[0];
    let rangeEnd = sorted[0];
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === rangeEnd + 1) {
        rangeEnd = sorted[i];
      } else {
        ranges.push({
          start: rangeStart * DEGREE_GRANULARITY,
          end: (rangeEnd + 1) * DEGREE_GRANULARITY,
        });
        rangeStart = sorted[i];
        rangeEnd = sorted[i];
      }
    }
    ranges.push({
      start: rangeStart * DEGREE_GRANULARITY,
      end: (rangeEnd + 1) * DEGREE_GRANULARITY,
    });
    return ranges;
  }, [coveredSegments]);

  const startWalkaround = useCallback(() => {
    setStartingAlpha(alpha);
    setCoveredSegments(new Set([0]));
  }, [alpha]);

  return useObjectMemo({
    startWalkaround,
    walkaroundPosition,
    coveragePercentage,
    coveredSegments: coveredSegmentRanges,
  });
}
