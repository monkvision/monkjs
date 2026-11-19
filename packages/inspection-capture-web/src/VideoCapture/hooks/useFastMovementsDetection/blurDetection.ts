/**
 * Ratio (relative to the session's sharpness baseline) below which the Laplace score of a selected frame is considered
 * too low, meaning that the frame is likely motion-blurred.
 *
 * A Laplace score of ~0.42x the score of the unblurred picture corresponds to ~10px of motion blur on a 4K frame, which
 * is the point at which ~10% of the frames become unusable for damage detection.
 */
export const BLUR_SCORE_RATIO_THRESHOLD = 0.42;

/**
 * Number of recent selected frame scores used to compute the session's sharpness baseline (their median). Scores of
 * frames considered too blurry are not added to the baseline, so that sustained blur does not lower it.
 */
export const BLUR_BASELINE_WINDOW = 10;

/**
 * Minimum number of selected frame scores that must be recorded before a blurry frames warning can be raised, so that
 * the sharpness baseline is reliable enough.
 */
export const BLUR_WARMUP_FRAMES = 3;

/**
 * Number of consecutive selected frames with a too low score required to raise a blurry frames warning. This avoids
 * raising the warning because of a single blurry frame or a single less textured part of the vehicle.
 */
export const BLUR_CONSECUTIVE_FRAMES = 2;

/**
 * The state of the blurry frames detection.
 */
export interface BlurDetectionState {
  /**
   * The most recent selected frame scores not considered too blurry (at most BLUR_BASELINE_WINDOW), oldest first.
   */
  scores: number[];
  /**
   * The number of consecutive selected frames whose score was too low compared to the baseline.
   */
  consecutiveLow: number;
}

/**
 * The result of a blurry frames detection update.
 */
export interface BlurDetectionResult {
  /**
   * The updated blurry frames detection state.
   */
  state: BlurDetectionState;
  /**
   * Boolean indicating if the recent selected frames are considered too blurry.
   */
  isBlurry: boolean;
}

/**
 * Creates a new, empty blurry frames detection state.
 */
export function createBlurDetectionState(): BlurDetectionState {
  return { scores: [], consecutiveLow: 0 };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

/**
 * Updates the blurry frames detection state with the Laplace score of a newly selected frame, and returns whether the
 * recent selected frames are considered too blurry.
 *
 * A frame is considered too blurry when its score is below BLUR_SCORE_RATIO_THRESHOLD times the median of the recent
 * frame scores (excluding the frames already considered too blurry). The warning is raised after
 * BLUR_CONSECUTIVE_FRAMES such frames in a row, once at least BLUR_WARMUP_FRAMES scores have been recorded.
 * Invalid scores (non-finite or not strictly positive) are ignored.
 */
export function updateBlurDetection(state: BlurDetectionState, score: number): BlurDetectionResult {
  if (!Number.isFinite(score) || score <= 0) {
    return { state, isBlurry: false };
  }
  const isWarmedUp = state.scores.length >= BLUR_WARMUP_FRAMES;
  const isLow = isWarmedUp && score < BLUR_SCORE_RATIO_THRESHOLD * median(state.scores);
  const newState: BlurDetectionState = {
    scores: isLow ? state.scores : [...state.scores, score].slice(-BLUR_BASELINE_WINDOW),
    consecutiveLow: isLow ? state.consecutiveLow + 1 : 0,
  };
  return { state: newState, isBlurry: newState.consecutiveLow >= BLUR_CONSECUTIVE_FRAMES };
}
