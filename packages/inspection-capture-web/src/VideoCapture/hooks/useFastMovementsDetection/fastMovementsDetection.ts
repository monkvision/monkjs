import { DeviceRotation } from '@monkvision/types';

const SMOOTH_MOVEMENT_FACTOR = 0.98;
const ALPHA_DETECTION_MIN = 2.5;
const ALPHA_DETECTION_MAX = 179;
const BETA_DETECTION_MIN = 4;
const BETA_DETECTION_MAX = 89;
const GAMMA_DETECTION_MIN = 4;
const GAMMA_DETECTION_MAX = 89;

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
 * Function used to detect fast user movements between DeviceOrientationEvent emissions.
 */
export function detectFastMovements(
  rotation: DeviceRotation,
  previousRotation: DeviceRotation,
): FastMovementType | null {
  const { alpha, beta, gamma } = rotation;
  const { alpha: prevAlpha, beta: prevBeta, gamma: prevGamma } = previousRotation;
  const alphaSpeed = Math.abs(alpha - prevAlpha) * SMOOTH_MOVEMENT_FACTOR;
  const betaSpeed = Math.abs(beta - prevBeta) * SMOOTH_MOVEMENT_FACTOR;
  const gammaSpeed = Math.abs(gamma - prevGamma) * SMOOTH_MOVEMENT_FACTOR;

  if (prevBeta !== 0 && betaSpeed > BETA_DETECTION_MIN && betaSpeed < BETA_DETECTION_MAX) {
    return FastMovementType.PHONE_SHAKING;
  }

  if (prevGamma !== 0 && gammaSpeed > GAMMA_DETECTION_MIN && gammaSpeed < GAMMA_DETECTION_MAX) {
    return FastMovementType.PHONE_SHAKING;
  }

  if (prevAlpha !== 0 && alphaSpeed > ALPHA_DETECTION_MIN && alphaSpeed < ALPHA_DETECTION_MAX) {
    return FastMovementType.WALKING_TOO_FAST;
  }

  return null;
}
