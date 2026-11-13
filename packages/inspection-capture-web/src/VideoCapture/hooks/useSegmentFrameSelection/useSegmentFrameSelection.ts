import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getAngleDifference, useObjectMemo } from '@monkvision/common';

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

/**
 * Hysteresis (in degrees) past the current bucket's edges before a new bucket is entered, so compass jitter doesn't
 * register unreached buckets. Capped at half a bucket so that small buckets can still be entered.
 */
export const BUCKET_ENTRY_MARGIN_DEG = 4;

function clampTargetFramesCount(targetFramesCount: number): number {
  return Math.min(MAX_TARGET_FRAMES_COUNT, Math.max(MIN_TARGET_FRAMES_COUNT, targetFramesCount));
}

function getDistanceToBucketEdges(
  position: number,
  bucket: number,
  bucketSizeDegrees: number,
): number {
  const bucketStart = bucket * bucketSizeDegrees;
  return Math.min(
    Math.abs(getAngleDifference(position, bucketStart)),
    Math.abs(getAngleDifference(position, bucketStart + bucketSizeDegrees)),
  );
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
 * Custom hook used to trigger a frame capture at evenly-spaced angular positions around the vehicle, so that exactly
 * `targetFramesCount` frames are captured over a full 360° walkaround, regardless of the speed or pattern at which
 * the user walks around the vehicle.
 *
 * Note: buckets skipped entirely by a fast walker still reduce this total.
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
  const bucketEntryMargin = Math.min(BUCKET_ENTRY_MARGIN_DEG, bucketSizeDegrees / 2);

  const [flushTrigger, setFlushTrigger] = useState(0);
  const capturedBuckets = useRef<Set<number>>(new Set());
  const currentBucket = useRef<number | null>(null);
  const [capturedFramesCount, setCapturedFramesCount] = useState(0);

  useEffect(() => {
    if (!isRecording) {
      return;
    }
    const bucket = Math.floor(walkaroundPosition / bucketSizeDegrees) % totalBuckets;
    if (currentBucket.current !== null) {
      if (bucket === currentBucket.current) {
        return;
      }
      const distance = getDistanceToBucketEdges(
        walkaroundPosition,
        currentBucket.current,
        bucketSizeDegrees,
      );
      if (distance < bucketEntryMargin) {
        return;
      }
    }
    currentBucket.current = bucket;
    if (capturedBuckets.current.has(bucket)) {
      return;
    }
    capturedBuckets.current.add(bucket);
    setCapturedFramesCount(capturedBuckets.current.size);
    setFlushTrigger((value) => value + 1);
  }, [walkaroundPosition, isRecording, bucketSizeDegrees, bucketEntryMargin, totalBuckets]);

  const startSegmentTracking = useCallback(() => {
    capturedBuckets.current = new Set([0]);
    currentBucket.current = 0;
    setCapturedFramesCount(1);
  }, []);

  return useObjectMemo({
    flushTrigger,
    capturedFramesCount,
    effectiveTargetFramesCount: totalBuckets,
    startSegmentTracking,
  });
}
