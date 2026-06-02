import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import type { CoveredSegment } from '@monkvision/common-ui-web';

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
   * Array of covered segments around the vehicle.
   */
  coveredSegments: CoveredSegment[];
  /**
   * Percentage of the walkaround completed.
   */
  coveragePercentage: number;
}

const DEGREE_GRANULARITY = 5;
const TOTAL_SEGMENTS = 360 / DEGREE_GRANULARITY;
const SMOOTHING_FACTOR = 0.3;

function normalizeAngle(angle: number): number {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function getAngleDifference(angle1: number, angle2: number): number {
  let diff = angle1 - angle2;
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }
  return diff;
}

function angleToSegment(angle: number): number {
  return Math.floor(normalizeAngle(angle) / DEGREE_GRANULARITY);
}

function segmentToAngle(segment: number): number {
  return segment * DEGREE_GRANULARITY;
}

function segmentsToRanges(coveredSet: Set<number>): CoveredSegment[] {
  if (coveredSet.size === 0) {
    return [];
  }

  const sortedSegments = Array.from(coveredSet).sort((a, b) => a - b);
  const ranges: CoveredSegment[] = [];
  let currentStart = sortedSegments[0];
  let currentEnd = sortedSegments[0];

  for (let i = 1; i < sortedSegments.length; i++) {
    const segment = sortedSegments[i];
    if (segment === currentEnd + 1) {
      currentEnd = segment;
    } else {
      ranges.push({
        start: segmentToAngle(currentStart),
        end: segmentToAngle(currentEnd) + DEGREE_GRANULARITY,
      });
      currentStart = segment;
      currentEnd = segment;
    }
  }

  ranges.push({
    start: segmentToAngle(currentStart),
    end: segmentToAngle(currentEnd) + DEGREE_GRANULARITY,
  });

  return ranges;
}

/**
 * Custom hook used to manage the vehicle walkaround tracking.
 */
export function useVehicleWalkaround({
  alpha,
}: UseVehicleWalkaroundParams): VehicleWalkaroundHandle {
  const [startingAlpha, setStartingAlpha] = useState<number | null>(null);
  const coveredSegmentsRef = useRef<Set<number>>(new Set());
  const [coverageUpdate, setCoverageUpdate] = useState(0);
  const smoothedAlphaRef = useRef<number | null>(null);
  const justStartedRef = useRef<boolean>(false);

  const smoothedAlpha = useMemo(() => {
    if (startingAlpha === null) {
      return alpha;
    }

    if (smoothedAlphaRef.current === null) {
      smoothedAlphaRef.current = alpha;
      return alpha;
    }

    const diff = getAngleDifference(alpha, smoothedAlphaRef.current);
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
    if (startingAlpha !== null) {
      if (justStartedRef.current) {
        justStartedRef.current = false;
        return;
      }

      const segment = angleToSegment(walkaroundPosition);

      if (!coveredSegmentsRef.current.has(segment)) {
        coveredSegmentsRef.current.add(segment);
        setCoverageUpdate((prev) => prev + 1);
      }
    }
  }, [walkaroundPosition, startingAlpha]);

  const coveredSegments = useMemo(
    () => segmentsToRanges(coveredSegmentsRef.current),
    [coverageUpdate],
  );

  const coveragePercentage = useMemo(
    () => (coveredSegmentsRef.current.size / TOTAL_SEGMENTS) * 100,
    [coverageUpdate],
  );

  const startWalkaround = useCallback(() => {
    setStartingAlpha(alpha);
    smoothedAlphaRef.current = alpha;
    coveredSegmentsRef.current.clear();
    justStartedRef.current = true;
    setCoverageUpdate((prev) => prev + 1);
  }, [alpha]);

  return useObjectMemo({
    startWalkaround,
    walkaroundPosition,
    coveredSegments,
    coveragePercentage,
  });
}
