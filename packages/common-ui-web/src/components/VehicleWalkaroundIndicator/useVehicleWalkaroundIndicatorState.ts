import { useEffect, useRef, useState } from 'react';
import { CoveredSegment } from './VehicleWalkaroundIndicator.types';

/**
 * Params passed to the useVehicleWalkaroundIndicatorState hook.
 */
export interface UseVehicleWalkaroundIndicatorStateParams {
  /**
   * The current walkaround position (0-360 degrees).
   */
  walkaroundPosition: number;
  /**
   * Whether segment tracking is active.
   */
  isTracking?: boolean;
}

/**
 * Handle returned by the useVehicleWalkaroundIndicatorState hook.
 */
export interface VehicleWalkaroundIndicatorStateHandle {
  /**
   * Array of covered segments for visual display.
   */
  coveredSegments: CoveredSegment[];
}

const DEGREE_GRANULARITY = 5;

function normalizeAngle(angle: number): number {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
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
 * Custom hook used to track covered segments for visual display in the VehicleWalkaroundIndicator component.
 * This is an internal hook that manages the visual representation of segment coverage.
 */
export function useVehicleWalkaroundIndicatorState({
  walkaroundPosition,
  isTracking = false,
}: UseVehicleWalkaroundIndicatorStateParams): VehicleWalkaroundIndicatorStateHandle {
  const [coveredSegments, setCoveredSegments] = useState<Set<number>>(new Set());
  const prevTrackingRef = useRef(isTracking);

  useEffect(() => {
    if (!prevTrackingRef.current && isTracking) {
      const newSegments = new Set<number>();
      newSegments.add(0);
      setCoveredSegments(newSegments);
    } else if (prevTrackingRef.current && !isTracking) {
      setCoveredSegments(new Set());
    }
    prevTrackingRef.current = isTracking;
  }, [isTracking]);

  useEffect(() => {
    if (isTracking) {
      const segment = angleToSegment(walkaroundPosition);

      if (!coveredSegments.has(segment)) {
        setCoveredSegments((prev) => new Set(prev).add(segment));
      }
    }
  }, [walkaroundPosition, isTracking, coveredSegments]);

  const coveredSegmentRanges = segmentsToRanges(coveredSegments);

  return {
    coveredSegments: coveredSegmentRanges,
  };
}
