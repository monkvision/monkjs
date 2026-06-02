export const MAX_ALPHA_JUMP = 50;

/**
 * Represents a covered arc segment of the walkaround (in degrees).
 */
export interface CoveredSegment {
  /**
   * Start angle in degrees (0-360).
   */
  start: number;
  /**
   * End angle in degrees (0-360).
   */
  end: number;
}

/**
 * Converts a set of covered segment indices to an array of CoveredSegment angle ranges.
 *
 * @param coveredSet - Set of covered segment indices.
 * @param degreeGranularity - The size of each segment in degrees (should be minimum 5 if using camera compass).
 */
export function segmentsToRanges(
  coveredSet: Set<number>,
  degreeGranularity: number,
): CoveredSegment[] {
  if (coveredSet.size === 0) {
    return [];
  }

  const sorted = Array.from(coveredSet).sort((a, b) => a - b);
  const ranges: CoveredSegment[] = [];
  let currentStart = sorted[0];
  let currentEnd = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === currentEnd + 1) {
      currentEnd = sorted[i];
    } else {
      ranges.push({
        start: currentStart * degreeGranularity,
        end: (currentEnd + 1) * degreeGranularity,
      });
      currentStart = sorted[i];
      currentEnd = sorted[i];
    }
  }

  ranges.push({
    start: currentStart * degreeGranularity,
    end: (currentEnd + 1) * degreeGranularity,
  });

  return ranges;
}

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
