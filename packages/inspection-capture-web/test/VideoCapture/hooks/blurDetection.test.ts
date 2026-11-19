import {
  BLUR_BASELINE_WINDOW,
  BLUR_CONSECUTIVE_FRAMES,
  BLUR_SCORE_RATIO_THRESHOLD,
  BLUR_WARMUP_FRAMES,
  BlurDetectionState,
  createBlurDetectionState,
  updateBlurDetection,
} from '../../../src/VideoCapture/hooks/useFastMovementsDetection/blurDetection';

const SHARP = 20;
const BLURRY = SHARP * BLUR_SCORE_RATIO_THRESHOLD * 0.9;

function feed(
  state: BlurDetectionState,
  scores: number[],
): { state: BlurDetectionState; results: boolean[] } {
  let current = state;
  const results: boolean[] = [];
  scores.forEach((score) => {
    const result = updateBlurDetection(current, score);
    current = result.state;
    results.push(result.isBlurry);
  });
  return { state: current, results };
}

function warmedUpState(): BlurDetectionState {
  return feed(createBlurDetectionState(), new Array(BLUR_WARMUP_FRAMES).fill(SHARP)).state;
}

describe('blurDetection', () => {
  it('should create an empty state', () => {
    expect(createBlurDetectionState()).toEqual({ scores: [], consecutiveLow: 0 });
  });

  it('should never report blurry frames during the warmup', () => {
    const { results } = feed(createBlurDetectionState(), [
      SHARP,
      ...new Array(BLUR_WARMUP_FRAMES - 1).fill(0.001),
    ]);
    expect(results.every((isBlurry) => !isBlurry)).toBe(true);
  });

  it('should not report a single low frame as blurry', () => {
    const { results } = feed(warmedUpState(), [BLURRY]);
    expect(results).toEqual([false]);
  });

  it('should report blurry frames after enough consecutive low frames', () => {
    const { results } = feed(warmedUpState(), new Array(BLUR_CONSECUTIVE_FRAMES).fill(BLURRY));
    expect(results[results.length - 1]).toBe(true);
    expect(results.slice(0, -1).every((isBlurry) => !isBlurry)).toBe(true);
  });

  it('should reset the low frames streak when a sharp frame is selected', () => {
    const { state, results } = feed(warmedUpState(), [BLURRY, SHARP, BLURRY]);
    expect(results).toEqual([false, false, false]);
    expect(state.consecutiveLow).toBe(1);
  });

  it('should not report frames slightly below the baseline as blurry', () => {
    const slightlyLower = SHARP * BLUR_SCORE_RATIO_THRESHOLD * 1.1;
    const { results } = feed(warmedUpState(), [slightlyLower, slightlyLower, slightlyLower]);
    expect(results.every((isBlurry) => !isBlurry)).toBe(true);
  });

  it('should use a median baseline that resists a single outlier', () => {
    const { results } = feed(createBlurDetectionState(), [
      SHARP,
      SHARP * 100,
      SHARP,
      SHARP,
      SHARP * 0.8,
      SHARP * 0.8,
    ]);
    expect(results.every((isBlurry) => !isBlurry)).toBe(true);
  });

  it('should only keep the most recent scores in the baseline window', () => {
    const { state } = feed(
      createBlurDetectionState(),
      new Array(BLUR_BASELINE_WINDOW + 5).fill(0).map((_, i) => i + 1),
    );
    expect(state.scores).toHaveLength(BLUR_BASELINE_WINDOW);
    expect(state.scores[state.scores.length - 1]).toBe(BLUR_BASELINE_WINDOW + 5);
  });

  it('should keep reporting sustained blur, without lowering the baseline', () => {
    const initial = warmedUpState();
    const { state, results } = feed(initial, new Array(10).fill(BLURRY));
    expect(results.slice(BLUR_CONSECUTIVE_FRAMES - 1).every((isBlurry) => isBlurry)).toBe(true);
    expect(state.scores).toEqual(initial.scores);
  });

  it('should ignore invalid scores', () => {
    const initial = warmedUpState();
    [0, -1, NaN, Infinity].forEach((score) => {
      const { state, isBlurry } = updateBlurDetection(initial, score);
      expect(state).toBe(initial);
      expect(isBlurry).toBe(false);
    });
  });
});
