import { DeviceRotation } from '@monkvision/types';
import { getAngleDifference } from '@monkvision/common';

const SMOOTH_MOVEMENT_FACTOR = 0.98;
const BETA_DETECTION_MIN = 4;
const BETA_DETECTION_MAX = 89;
const GAMMA_DETECTION_MIN = 4;
const GAMMA_DETECTION_MAX = 89;

/**
 * Duration (in ms) of the rolling window used to measure the compass's sustained rotation speed.
 */
export const WALKING_DETECTION_WINDOW_MS = 700;

/**
 * Minimum time span (in ms) that must be covered by the rolling window before a rotation speed measurement is
 * considered reliable. This avoids computing a noisy velocity over a too short (e.g. single-frame) time span.
 */
export const WALKING_DETECTION_MIN_WINDOW_MS = 350;

/**
 * Sustained compass rotation speed (in degrees per second) above which the user is considered to be walking too
 * fast around the vehicle.
 *
 * Derived from the target walkaround duration of ~50 seconds for a full 360° turn (an average speed of
 * ~9 deg/sec), with a safety margin applied on top of that average.
 */
export const WALKING_VELOCITY_THRESHOLD_DEG_PER_SEC = 24;

/**
 * Enumeration of the different fast movements that can be detected.
 */
export enum FastMovementType {
  /**
   * The user is walking too fast around the vehicle.
   */
  WALKING_TOO_FAST = 'walking_too_fast',
  /**
   * The user is shaking their phone too much.
   */
  PHONE_SHAKING = 'phone_shaking',
}

/**
 * A single timestamped alpha (compass heading) sample, used to measure the sustained rotation speed of the device
 * over a rolling window.
 */
export interface AlphaSample {
  /**
   * The compass heading, in degrees.
   */
  alpha: number;
  /**
   * The timestamp (in ms, as returned by Date.now()) at which this sample was recorded.
   */
  timestamp: number;
}

/**
 * Returns a new alpha history array with every sample older than WALKING_DETECTION_WINDOW_MS (relative to the given
 * timestamp) removed.
 */
export function pruneAlphaHistory(history: AlphaSample[], timestamp: number): AlphaSample[] {
  return history.filter((sample) => timestamp - sample.timestamp <= WALKING_DETECTION_WINDOW_MS);
}

function detectWalkingTooFast(alphaHistory: AlphaSample[]): boolean {
  if (alphaHistory.length < 2) {
    return false;
  }
  const oldest = alphaHistory[0];
  const newest = alphaHistory[alphaHistory.length - 1];
  const elapsedMs = newest.timestamp - oldest.timestamp;

  if (elapsedMs < WALKING_DETECTION_MIN_WINDOW_MS) {
    return false;
  }

  const displacement = Math.abs(getAngleDifference(newest.alpha, oldest.alpha));
  const velocityDegPerSec = (displacement / elapsedMs) * 1000;

  return velocityDegPerSec > WALKING_VELOCITY_THRESHOLD_DEG_PER_SEC;
}

function detectPhoneShaking(rotation: DeviceRotation, previousRotation: DeviceRotation): boolean {
  const { beta, gamma } = rotation;
  const { beta: prevBeta, gamma: prevGamma } = previousRotation;
  const betaSpeed = Math.abs(beta - prevBeta) * SMOOTH_MOVEMENT_FACTOR;
  const gammaSpeed = Math.abs(gamma - prevGamma) * SMOOTH_MOVEMENT_FACTOR;

  if (prevBeta !== 0 && betaSpeed > BETA_DETECTION_MIN && betaSpeed < BETA_DETECTION_MAX) {
    return true;
  }
  if (prevGamma !== 0 && gammaSpeed > GAMMA_DETECTION_MIN && gammaSpeed < GAMMA_DETECTION_MAX) {
    return true;
  }
  return false;
}

/**
 * Function used to detect fast user movements based on device rotation data.
 *
 * Phone shaking is detected from the instantaneous beta/gamma delta between two consecutive readings.
 * Walking too fast is detected from the sustained alpha rotation speed measured over a rolling window.
 */
export function detectFastMovements(
  rotation: DeviceRotation,
  previousRotation: DeviceRotation,
  alphaHistory: AlphaSample[],
): FastMovementType | null {
  if (detectPhoneShaking(rotation, previousRotation)) {
    return FastMovementType.PHONE_SHAKING;
  }
  if (detectWalkingTooFast(alphaHistory)) {
    return FastMovementType.WALKING_TOO_FAST;
  }
  return null;
}
