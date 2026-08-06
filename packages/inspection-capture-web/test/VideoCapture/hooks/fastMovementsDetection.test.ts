import {
  AlphaSample,
  detectFastMovements,
  FastMovementType,
  pruneAlphaHistory,
  WALKING_DETECTION_MIN_WINDOW_MS,
  WALKING_DETECTION_WINDOW_MS,
  WALKING_VELOCITY_THRESHOLD_DEG_PER_SEC,
} from '../../../src/VideoCapture/hooks/useFastMovementsDetection/fastMovementsDetection';

function buildAlphaHistory(
  alphas: number[],
  intervalMs: number,
  startTimestamp = 0,
): AlphaSample[] {
  return alphas.map((alpha, i) => ({ alpha, timestamp: startTimestamp + i * intervalMs }));
}

describe('pruneAlphaHistory function', () => {
  it('should remove samples older than the detection window relative to the given timestamp', () => {
    const history = buildAlphaHistory([0, 10, 20, 30], 200);
    const now = history[history.length - 1].timestamp;
    const result = pruneAlphaHistory(history, now);

    result.forEach((sample) => {
      expect(now - sample.timestamp).toBeLessThanOrEqual(WALKING_DETECTION_WINDOW_MS);
    });
  });

  it('should keep samples within the detection window', () => {
    const history = buildAlphaHistory([0, 10], 100);
    const now = history[history.length - 1].timestamp;
    const result = pruneAlphaHistory(history, now);

    expect(result).toEqual(history);
  });
});

describe('detectFastMovements function', () => {
  const rotation = { alpha: 0, beta: 0, gamma: 0 };
  const previousRotation = { alpha: 0, beta: 0, gamma: 0 };

  it('should return null when the alpha history has less than two samples', () => {
    const history = buildAlphaHistory([10], 0);
    const result = detectFastMovements(rotation, previousRotation, history);

    expect(result).toBeNull();
  });

  it('should return null when the window elapsed time is below the minimum required duration', () => {
    const history = buildAlphaHistory(
      [0, WALKING_VELOCITY_THRESHOLD_DEG_PER_SEC * 10],
      WALKING_DETECTION_MIN_WINDOW_MS - 50,
    );
    const result = detectFastMovements(rotation, previousRotation, history);

    expect(result).toBeNull();
  });

  it('should return null when the sustained rotation speed is below the threshold', () => {
    const elapsedMs = WALKING_DETECTION_MIN_WINDOW_MS + 100;
    const slowDisplacement = (WALKING_VELOCITY_THRESHOLD_DEG_PER_SEC / 1000) * elapsedMs * 0.5;
    const history = buildAlphaHistory([0, slowDisplacement], elapsedMs);
    const result = detectFastMovements(rotation, previousRotation, history);

    expect(result).toBeNull();
  });

  it('should return WALKING_TOO_FAST when the sustained rotation speed exceeds the threshold', () => {
    const elapsedMs = WALKING_DETECTION_MIN_WINDOW_MS + 100;
    const fastDisplacement = (WALKING_VELOCITY_THRESHOLD_DEG_PER_SEC / 1000) * elapsedMs * 2;
    const history = buildAlphaHistory([0, fastDisplacement], elapsedMs);
    const result = detectFastMovements(rotation, previousRotation, history);

    expect(result).toEqual(FastMovementType.WALKING_TOO_FAST);
  });

  it('should correctly handle rotation crossing the 0/360 degrees compass boundary', () => {
    const elapsedMs = WALKING_DETECTION_MIN_WINDOW_MS + 100;
    // A rotation from 358 to 3 degrees is a real displacement of only 5 degrees.
    const history = buildAlphaHistory([358, 3], elapsedMs);
    const result = detectFastMovements(rotation, previousRotation, history);

    expect(result).toBeNull();
  });

  it('should detect a fast rotation that crosses the 0/360 degrees compass boundary', () => {
    const elapsedMs = WALKING_DETECTION_MIN_WINDOW_MS + 100;
    const fastDisplacement = (WALKING_VELOCITY_THRESHOLD_DEG_PER_SEC / 1000) * elapsedMs * 2;
    // Wraps around 360 -> 0 while covering fastDisplacement degrees.
    const startAlpha = 360 - fastDisplacement / 2;
    const endAlpha = fastDisplacement / 2;
    const history = buildAlphaHistory([startAlpha, endAlpha], elapsedMs);
    const result = detectFastMovements(rotation, previousRotation, history);

    expect(result).toEqual(FastMovementType.WALKING_TOO_FAST);
  });

  it('should not trigger from an isolated single-frame spike with no sustained rate', () => {
    const history = buildAlphaHistory([0, 90], 10);
    const result = detectFastMovements(rotation, previousRotation, history);

    expect(result).toBeNull();
  });

  it('should return PHONE_SHAKING when beta changes abruptly', () => {
    const history = buildAlphaHistory([0, 1], WALKING_DETECTION_MIN_WINDOW_MS + 100);
    const result = detectFastMovements(
      { alpha: 0, beta: 20, gamma: 0 },
      { alpha: 0, beta: 1, gamma: 0 },
      history,
    );

    expect(result).toEqual(FastMovementType.PHONE_SHAKING);
  });

  it('should return PHONE_SHAKING when gamma changes abruptly', () => {
    const history = buildAlphaHistory([0, 1], WALKING_DETECTION_MIN_WINDOW_MS + 100);
    const result = detectFastMovements(
      { alpha: 0, beta: 0, gamma: 20 },
      { alpha: 0, beta: 0, gamma: 1 },
      history,
    );

    expect(result).toEqual(FastMovementType.PHONE_SHAKING);
  });

  it('should prioritize PHONE_SHAKING detection over WALKING_TOO_FAST', () => {
    const elapsedMs = WALKING_DETECTION_MIN_WINDOW_MS + 100;
    const fastDisplacement = (WALKING_VELOCITY_THRESHOLD_DEG_PER_SEC / 1000) * elapsedMs * 2;
    const history = buildAlphaHistory([0, fastDisplacement], elapsedMs);
    const result = detectFastMovements(
      { alpha: fastDisplacement, beta: 20, gamma: 0 },
      { alpha: 0, beta: 1, gamma: 0 },
      history,
    );

    expect(result).toEqual(FastMovementType.PHONE_SHAKING);
  });
});
