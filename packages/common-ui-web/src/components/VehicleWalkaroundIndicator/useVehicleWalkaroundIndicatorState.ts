import { useEffect, useRef, useState } from 'react';
import { angleToSegment, segmentToAngle } from '@monkvision/common';
import { CoveredSegment } from './VehicleWalkaroundIndicator.types';

/**
 * Granularity (in degrees) used for dividing the 360-degree circle into segments for vehicle walkaround tracking.
 * This constant determines the precision of position tracking during vehicle inspections.
 */
export const DEGREE_GRANULARITY = 5;

/**
 * Params passed to the useVehicleWalkaroundIndicatorState hook.
 */
export interface UseVehicleWalkaroundIndicatorStateParams {
  /**
   * The current walkaround position (0-360 degrees).
   */
  walkaroundPosition: number;
  /**
   * Whether video recording is active.
   */
  isRecording?: boolean;
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
        start: segmentToAngle(currentStart, DEGREE_GRANULARITY),
        end: segmentToAngle(currentEnd, DEGREE_GRANULARITY) + DEGREE_GRANULARITY,
      });
      currentStart = segment;
      currentEnd = segment;
    }
  }

  ranges.push({
    start: segmentToAngle(currentStart, DEGREE_GRANULARITY),
    end: segmentToAngle(currentEnd, DEGREE_GRANULARITY) + DEGREE_GRANULARITY,
  });

  return ranges;
}

/**
 * Custom hook used to track covered segments for visual display in the VehicleWalkaroundIndicator component.
 * This is an internal hook that manages the visual representation of segment coverage.
 */
export function useVehicleWalkaroundIndicatorState({
  walkaroundPosition,
  isRecording = false,
}: UseVehicleWalkaroundIndicatorStateParams): VehicleWalkaroundIndicatorStateHandle {
  const [coveredSegments, setCoveredSegments] = useState<Set<number>>(new Set());
  const prevIsRecordingRef = useRef(isRecording);

  useEffect(() => {
    if (!prevIsRecordingRef.current && isRecording) {
      const initialSegment = angleToSegment(walkaroundPosition, DEGREE_GRANULARITY);
      setCoveredSegments(new Set<number>().add(initialSegment));
    } else if (prevIsRecordingRef.current && !isRecording) {
      setCoveredSegments(new Set<number>());
    }
    prevIsRecordingRef.current = isRecording;
  }, [isRecording, walkaroundPosition]);

  useEffect(() => {
    if (isRecording) {
      const segment = angleToSegment(walkaroundPosition, DEGREE_GRANULARITY);
      if (!coveredSegments.has(segment)) {
        setCoveredSegments((prev) => new Set(prev).add(segment));
      }
    }
  }, [walkaroundPosition, isRecording]);

  return {
    coveredSegments: segmentsToRanges(coveredSegments),
  };
}
