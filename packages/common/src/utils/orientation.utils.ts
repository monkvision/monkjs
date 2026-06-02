export const MAX_ALPHA_JUMP = 50;

/**
 * Normalizes an angle to the range [0, 360).
 */
export function normalizeAngle(angle: number): number {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

/**
 * Calculates the shortest angular difference between two angles.
 * The result is in the range [-180, 180).
 */
export function getAngleDifference(angle1: number, angle2: number): number {
  let diff = angle1 - angle2;
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }
  return diff;
}

/**
 * Filters out anomalous alpha value jumps caused by sensor resets, device recalibration, magnetic interference,
 * or other device compass glitches.
 *
 * @param alpha - The current alpha value from the device orientation sensor (0-360 degrees).
 * @param prevAlpha - The previous raw alpha value.
 * @param filteredAlpha - The last known valid (filtered) alpha value.
 * @returns The filtered alpha value (either the current alpha if valid, or the previous filtered alpha if anomalous).
 */
export function filterAlphaJumps(alpha: number, prevAlpha: number, filteredAlpha: number): number {
  if (alpha === 0 && prevAlpha !== 0) {
    return filteredAlpha;
  }

  if (prevAlpha !== 0) {
    const diff = Math.abs(alpha - prevAlpha);
    const angularDiff = Math.min(diff, 360 - diff);

    if (angularDiff > MAX_ALPHA_JUMP) {
      return filteredAlpha;
    }
  }

  return alpha;
}
