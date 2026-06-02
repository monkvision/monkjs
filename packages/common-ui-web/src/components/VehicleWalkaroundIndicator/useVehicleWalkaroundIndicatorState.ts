import { useEffect, useState } from 'react';
import { angleToSegment, segmentToAngle } from '@monkvision/common';
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
   * Whether video recording is active.
   *
   * @default false
   */
  isRecording?: boolean;
  /**
   * Whether video recording is paused.
   *
   * @default false
   */
  isRecordingPaused?: boolean;
  /**
   * Granularity (in degrees) used for dividing the 360-degree circle into segments.
   *
   * @default 5
   */
  degreeGranularity?: number;
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

function segmentsToRanges(coveredSet: Set<number>, degreeGranularity: number): CoveredSegment[] {
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
        start: segmentToAngle(currentStart, degreeGranularity),
        end: segmentToAngle(currentEnd, degreeGranularity) + degreeGranularity,
      });
      currentStart = segment;
      currentEnd = segment;
    }
  }

  ranges.push({
    start: segmentToAngle(currentStart, degreeGranularity),
    end: segmentToAngle(currentEnd, degreeGranularity) + degreeGranularity,
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
  isRecordingPaused = false,
  degreeGranularity = 5,
}: UseVehicleWalkaroundIndicatorStateParams): VehicleWalkaroundIndicatorStateHandle {
  const [coveredSegments, setCoveredSegments] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isRecording && !isRecordingPaused) {
      setCoveredSegments(new Set<number>());
    }
  }, [isRecording, isRecordingPaused]);

  useEffect(() => {
    if (isRecording) {
      const segment = angleToSegment(walkaroundPosition, degreeGranularity);
      if (!coveredSegments.has(segment)) {
        setCoveredSegments((prev) => new Set(prev).add(segment));
      }
    }
  }, [walkaroundPosition, isRecording]);

  return {
    coveredSegments: segmentsToRanges(coveredSegments, degreeGranularity),
  };
}
