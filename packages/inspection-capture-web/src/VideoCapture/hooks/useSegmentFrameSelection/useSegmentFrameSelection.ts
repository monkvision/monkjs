import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Lower bound of the target frame count, corresponding to the widest allowed spacing between two captured frames
 * (10°).
 */
export const MIN_TARGET_FRAMES_COUNT = 36;

/**
 * Upper bound of the target frame count, corresponding to the narrowest allowed spacing between two captured frames
 * (5°).
 */
export const MAX_TARGET_FRAMES_COUNT = 72;

function clampTargetFramesCount(targetFramesCount: number): number {
  return Math.min(MAX_TARGET_FRAMES_COUNT, Math.max(MIN_TARGET_FRAMES_COUNT, targetFramesCount));
}

/**
 * Params accepted by the useSegmentFrameSelection hook.
 */
export interface UseSegmentFrameSelectionParams {
  /**
   * The current angular position of the user relative to the start of the walkaround (between 0 and 360).
   */
  walkaroundPosition: number;
  /**
   * Boolean indicating if the video is currently recording or not.
   */
  isRecording: boolean;
  /**
   * The target number of frames to capture over a full 360° walkaround. This value is clamped between
   * MIN_TARGET_FRAMES_COUNT and MAX_TARGET_FRAMES_COUNT so that the spacing between two captured frames always stays
   * between 5° and 10°.
   */
  targetFramesCount: number;
}

/**
 * Handle returned by the useSegmentFrameSelection hook.
 */
export interface SegmentFrameSelectionHandle {
  /**
   * Counter incremented every time a new frame should be selected and flushed.
   */
  flushTrigger: number;
  /**
   * The number of distinct angular buckets captured so far during the current walkaround.
   */
  capturedFramesCount: number;
  /**
   * The effective target number of frames used by the hook (`targetFramesCount` clamped between
   * MIN_TARGET_FRAMES_COUNT and MAX_TARGET_FRAMES_COUNT).
   */
  effectiveTargetFramesCount: number;
  /**
   * Callback called at the start of the walkaround to reset the frame capture tracking.
   */
  startSegmentTracking: () => void;
}

/**
 * Custom hook used to trigger a frame capture at evenly-spaced angular positions around the vehicle, so that a
 * predictable number of frames (targetFramesCount, +/- 1) are captured over a full 360° walkaround, regardless of
 * the speed or pattern at which the user walks around the vehicle.
 *
 * The walkaround is divided into `targetFramesCount` buckets. Every time the user's position enters a bucket that
 * has not already been captured, a new frame is triggered. Because captured buckets are tracked for the whole
 * duration of the walkaround (and not reset when recording is paused), pausing, moving backwards and resuming does
 * not trigger duplicate captures on segments that have already been photographed.
 */
export function useSegmentFrameSelection({
  walkaroundPosition,
  isRecording,
  targetFramesCount,
}: UseSegmentFrameSelectionParams): SegmentFrameSelectionHandle {
  const totalBuckets = useMemo(
    () => clampTargetFramesCount(targetFramesCount),
    [targetFramesCount],
  );
  const bucketSizeDegrees = 360 / totalBuckets;

  const [flushTrigger, setFlushTrigger] = useState(0);
  const [capturedBuckets, setCapturedBuckets] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!isRecording) {
      return;
    }
    const currentBucket = Math.floor(walkaroundPosition / bucketSizeDegrees) % totalBuckets;
    if (!capturedBuckets.has(currentBucket)) {
      setCapturedBuckets((prev) => new Set(prev).add(currentBucket));
      setFlushTrigger((value) => value + 1);
    }
  }, [walkaroundPosition, isRecording, bucketSizeDegrees, totalBuckets, capturedBuckets]);

  const startSegmentTracking = useCallback(() => {
    setCapturedBuckets(new Set([0]));
    setFlushTrigger((value) => value + 1);
  }, []);

  return {
    flushTrigger,
    capturedFramesCount: capturedBuckets.size,
    effectiveTargetFramesCount: totalBuckets,
    startSegmentTracking,
  };
}
