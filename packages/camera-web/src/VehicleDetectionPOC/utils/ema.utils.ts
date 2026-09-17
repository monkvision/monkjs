import { DETECTION_INTERVAL_MS } from '../constants';
import { CenterBox } from '../types';

/**
 * Corrects a smoothing factor for a variable timestep, so that the smoothing *feels* identical whatever the effective
 * tick rate is.
 *
 * The inference loop skips ticks when a call goes over its time budget, so the interval between two samples is not
 * constant. Without this correction, the box would visibly sharpen whenever the device is under load.
 *
 * @param alpha The smoothing factor calibrated for the nominal tick interval.
 * @param dtMs The actual time elapsed since the previous sample, in milliseconds.
 * @return The corrected smoothing factor.
 */
export function getTimeCorrectedAlpha(alpha: number, dtMs: number): number {
  if (dtMs <= 0) {
    return alpha;
  }
  return 1 - (1 - alpha) ** (dtMs / DETECTION_INTERVAL_MS);
}

/**
 * Applies an exponential moving average to a bounding box : `smoothed = alpha * current + (1 - alpha) * previous`.
 *
 * The box is smoothed in center form rather than corner form. Numerically the two are equivalent, because the EMA is
 * a linear operator and `center = origin + size / 2` is an affine map, so both parameterizations produce the exact
 * same box. Center form is used because it is the only one that allows position and size to be damped independently,
 * which matters here : the *edges* of a detection jitter much harder than its center.
 *
 * @param previous The previous smoothed box, or null to initialize the accumulator.
 * @param current The box observed on this tick.
 * @param alphaPosition The smoothing factor applied to the center of the box.
 * @param alphaSize The smoothing factor applied to the size of the box.
 * @return The new smoothed box.
 */
export function applyEma(
  previous: CenterBox | null,
  current: CenterBox,
  alphaPosition: number,
  alphaSize: number,
): CenterBox {
  // The first sample after a reset initializes the accumulator to the observation itself. Starting anywhere else
  // would make the box crawl towards the truth over roughly a second (the time constant at the default factor is
  // 0.5s), emitting a sequence of instructions that never actually applied along the way.
  if (!previous) {
    return current;
  }
  return {
    xCenter: alphaPosition * current.xCenter + (1 - alphaPosition) * previous.xCenter,
    yCenter: alphaPosition * current.yCenter + (1 - alphaPosition) * previous.yCenter,
    width: alphaSize * current.width + (1 - alphaSize) * previous.width,
    height: alphaSize * current.height + (1 - alphaSize) * previous.height,
  };
}
