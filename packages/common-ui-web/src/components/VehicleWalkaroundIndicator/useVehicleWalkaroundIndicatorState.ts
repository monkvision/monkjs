import { useEffect, useState } from 'react';
import { CoveredSegment, segmentsToRanges } from '@monkvision/common';
import { WalkaroundTrackingState } from './VehicleWalkaroundIndicator.types';

const DEGREE_GRANULARITY = 5;
const TOTAL_SEGMENTS = 360 / DEGREE_GRANULARITY;

/**
 * Params passed to the useVehicleWalkaroundIndicatorState hook.
 */
export interface UseVehicleWalkaroundIndicatorStateParams {
  /**
   * The current walkaround position (0-360 degrees).
   */
  walkaroundPosition: number;
  /**
   * The current state of coverage tracking.
   * - `WalkaroundTrackingState.Off`: No tracking. Covered segments are cleared.
   * - `WalkaroundTrackingState.Active`: Tracking is ongoing. Covered segments are updated as the position changes.
   * - `WalkaroundTrackingState.Paused`: Tracking is paused. Covered segments are retained but not updated.
   *
   * @default WalkaroundTrackingState.Off
   */
  trackingState?: WalkaroundTrackingState;
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

/**
 * Custom hook used to track covered segments for visual display in the VehicleWalkaroundIndicator component.
 * This is an internal hook that manages the visual representation of segment coverage.
 */
export function useVehicleWalkaroundIndicatorState({
  walkaroundPosition,
  trackingState = WalkaroundTrackingState.Off,
}: UseVehicleWalkaroundIndicatorStateParams): VehicleWalkaroundIndicatorStateHandle {
  const [coveredSegments, setCoveredSegments] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (trackingState === WalkaroundTrackingState.Off) {
      setCoveredSegments(new Set<number>());
    }
  }, [trackingState]);

  useEffect(() => {
    if (trackingState === WalkaroundTrackingState.Active) {
      const segment = Math.floor(walkaroundPosition / DEGREE_GRANULARITY) % TOTAL_SEGMENTS;
      if (!coveredSegments.has(segment)) {
        setCoveredSegments((prev) => new Set(prev).add(segment));
      }
    }
  }, [walkaroundPosition, trackingState]);

  return {
    coveredSegments: segmentsToRanges(coveredSegments, DEGREE_GRANULARITY),
  };
}
