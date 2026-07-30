import { useEffect, useRef, useState } from 'react';
import { getAngleDifference, useInterval } from '@monkvision/common';

/**
 * The minimum interval (in milliseconds) that can be returned by the adaptive frame selection algorithm.
 * This is the fastest upload rate, reached when the user walks around the vehicle quickly.
 */
export const ADAPTIVE_MIN_INTERVAL_MS = 500;
/**
 * The maximum interval (in milliseconds) that can be returned by the adaptive frame selection algorithm.
 * This is the slowest upload rate, reached when the user is stationary or moving very slowly.
 */
export const ADAPTIVE_MAX_INTERVAL_MS = 2000;
/**
 * The target angular distance (in degrees) that the user should walk around the vehicle between two selected frames.
 * This value is calibrated against an average walkaround duration of 40-50s (360deg / 45s ~= 8deg/s).
 */
export const TARGET_DEGREES_PER_FRAME = 8;
/**
 * The interval (in milliseconds) at which the device orientation (alpha) is sampled to estimate the angular velocity.
 *
 * This window needs to stay wide enough that ordinary compass jitter (a few degrees) doesn't get amplified into a
 * disproportionate velocity reading : e.g. at 300ms, a 5deg jitter alone computes to 16.7deg/s, which is already
 * twice the target pace.
 */
export const VELOCITY_SAMPLING_INTERVAL_MS = 500;
/**
 * The minimum angular delta (in degrees) between two samples for it to be considered actual movement. Deltas below
 * this threshold are treated as sensor noise (compass jitter while stationary) and floored to a velocity of 0.
 */
export const MIN_SIGNIFICANT_ANGLE_DEGREES = 1.5;
/**
 * The smoothing factor (between 0 and 1) of the exponential moving average applied to the angular velocity.
 * Lower values result in smoother (but less reactive) velocity estimations, filtering out the noise of
 * the device compass.
 */
export const EMA_SMOOTHING = 0.2;
/**
 * The step (in milliseconds) at which the adaptive interval is quantized.
 */
export const INTERVAL_QUANTIZATION_MS = 250;

/**
 * Params accepted by the useAdaptiveFrameSelectionInterval hook.
 */
export interface UseAdaptiveFrameSelectionIntervalParams {
  /**
   * The alpha value of the device orientation. Used to estimate the angular velocity of the walkaround.
   */
  alpha: number;
  /**
   * Whether video recording is currently active.
   * The angular velocity is only tracked while recording.
   */
  isRecording: boolean;
}

/**
 * Quantizes the given value to the nearest multiple of `INTERVAL_QUANTIZATION_MS`, clamped to the
 * `[ADAPTIVE_MIN_INTERVAL_MS, ADAPTIVE_MAX_INTERVAL_MS]` range.
 *
 * Note: The frame selection relies on `useInterval`, which recreates its underlying `setInterval` timer every time the
 * delay changes. Quantizing the output limits the number of distinct values it can take, keeping that timer stable and
 * preventing frame selection from being starved during continuous acceleration.
 */
function quantizeInterval(interval: number): number {
  const clamped = Math.min(ADAPTIVE_MAX_INTERVAL_MS, Math.max(ADAPTIVE_MIN_INTERVAL_MS, interval));
  return Math.round(clamped / INTERVAL_QUANTIZATION_MS) * INTERVAL_QUANTIZATION_MS;
}

/**
 * Custom hook used to dynamically adapt the frame selection interval based on how fast the user walks around the
 * vehicle.
 *
 * The resulting interval is smoothed (via an exponential moving average of the velocity) and quantized to
 * `INTERVAL_QUANTIZATION_MS` steps, clamped to the `[ADAPTIVE_MIN_INTERVAL_MS, ADAPTIVE_MAX_INTERVAL_MS]` range.
 */
export function useAdaptiveFrameSelectionInterval({
  alpha,
  isRecording,
}: UseAdaptiveFrameSelectionIntervalParams): number {
  const [interval, setIntervalValue] = useState(ADAPTIVE_MAX_INTERVAL_MS);
  const previousAlpha = useRef<number | null>(null);
  const smoothedVelocity = useRef(0);

  useInterval(
    () => {
      if (previousAlpha.current === null) {
        previousAlpha.current = alpha;
        return;
      }
      const angleDelta = Math.abs(getAngleDifference(alpha, previousAlpha.current));
      previousAlpha.current = alpha;
      const velocity =
        angleDelta < MIN_SIGNIFICANT_ANGLE_DEGREES
          ? 0
          : angleDelta / (VELOCITY_SAMPLING_INTERVAL_MS / 1000);

      smoothedVelocity.current =
        EMA_SMOOTHING * velocity + (1 - EMA_SMOOTHING) * smoothedVelocity.current;

      const nextInterval =
        smoothedVelocity.current <= 0
          ? ADAPTIVE_MAX_INTERVAL_MS
          : (TARGET_DEGREES_PER_FRAME / smoothedVelocity.current) * 1000;
      setIntervalValue(quantizeInterval(nextInterval));
    },
    isRecording ? VELOCITY_SAMPLING_INTERVAL_MS : null,
  );

  useEffect(() => {
    if (!isRecording) {
      previousAlpha.current = null;
      smoothedVelocity.current = 0;
      setIntervalValue(ADAPTIVE_MAX_INTERVAL_MS);
    }
  }, [isRecording]);

  return interval;
}
