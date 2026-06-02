import {
  angleToSegment,
  filterAlphaJumps,
  getAngleDifference,
  normalizeAngle,
  segmentToAngle,
} from '../../src';

describe('normalizeAngle', () => {
  it('should return the same angle if it is already in [0, 360)', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(90)).toBe(90);
    expect(normalizeAngle(180)).toBe(180);
    expect(normalizeAngle(270)).toBe(270);
    expect(normalizeAngle(359)).toBe(359);
  });

  it('should normalize negative angles to positive', () => {
    expect(normalizeAngle(-10)).toBe(350);
    expect(normalizeAngle(-90)).toBe(270);
    expect(normalizeAngle(-180)).toBe(180);
    expect(normalizeAngle(-270)).toBe(90);
  });

  it('should normalize angles >= 360 to [0, 360)', () => {
    expect(normalizeAngle(360)).toBe(0);
    expect(normalizeAngle(370)).toBe(10);
    expect(normalizeAngle(450)).toBe(90);
    expect(normalizeAngle(720)).toBe(0);
  });

  it('should handle large positive and negative angles', () => {
    expect(normalizeAngle(1000)).toBe(280);
    expect(normalizeAngle(-1000)).toBe(80);
  });
});

describe('getAngleDifference', () => {
  it('should return the correct difference for angles in the same quadrant', () => {
    expect(getAngleDifference(90, 80)).toBe(10);
    expect(getAngleDifference(80, 90)).toBe(-10);
  });

  it('should return the shortest path across 0/360 boundary', () => {
    expect(getAngleDifference(10, 350)).toBe(20);
    expect(getAngleDifference(350, 10)).toBe(-20);
  });

  it('should handle angles exactly 180 degrees apart', () => {
    expect(getAngleDifference(0, 180)).toBe(-180);
    expect(getAngleDifference(90, 270)).toBe(-180);
  });

  it('should return difference in range [-180, 180)', () => {
    expect(getAngleDifference(270, 90)).toBe(180);
    expect(getAngleDifference(90, 270)).toBe(-180);
    expect(getAngleDifference(0, 270)).toBe(90);
    expect(getAngleDifference(270, 0)).toBe(-90);
  });

  it('should return 0 for identical angles', () => {
    expect(getAngleDifference(0, 0)).toBe(0);
    expect(getAngleDifference(180, 180)).toBe(0);
  });
});

describe('angleToSegment', () => {
  const GRANULARITY = 5;

  it('should convert angle to correct segment index', () => {
    expect(angleToSegment(0, GRANULARITY)).toBe(0);
    expect(angleToSegment(5, GRANULARITY)).toBe(1);
    expect(angleToSegment(10, GRANULARITY)).toBe(2);
    expect(angleToSegment(355, GRANULARITY)).toBe(71);
  });

  it('should floor partial segments', () => {
    expect(angleToSegment(4, GRANULARITY)).toBe(0);
    expect(angleToSegment(7, GRANULARITY)).toBe(1);
    expect(angleToSegment(359, GRANULARITY)).toBe(71);
  });

  it('should handle negative angles by normalizing first', () => {
    expect(angleToSegment(-5, GRANULARITY)).toBe(71);
    expect(angleToSegment(-10, GRANULARITY)).toBe(70);
  });

  it('should handle different granularities', () => {
    expect(angleToSegment(0, 10)).toBe(0);
    expect(angleToSegment(10, 10)).toBe(1);
    expect(angleToSegment(350, 10)).toBe(35);

    expect(angleToSegment(0, 1)).toBe(0);
    expect(angleToSegment(180, 1)).toBe(180);
    expect(angleToSegment(359, 1)).toBe(359);
  });
});

describe('segmentToAngle', () => {
  const GRANULARITY = 5;

  it('should convert segment index to starting angle', () => {
    expect(segmentToAngle(0, GRANULARITY)).toBe(0);
    expect(segmentToAngle(1, GRANULARITY)).toBe(5);
    expect(segmentToAngle(2, GRANULARITY)).toBe(10);
    expect(segmentToAngle(71, GRANULARITY)).toBe(355);
  });

  it('should handle different granularities', () => {
    expect(segmentToAngle(0, 10)).toBe(0);
    expect(segmentToAngle(1, 10)).toBe(10);
    expect(segmentToAngle(36, 10)).toBe(360);

    expect(segmentToAngle(0, 1)).toBe(0);
    expect(segmentToAngle(180, 1)).toBe(180);
    expect(segmentToAngle(359, 1)).toBe(359);
  });

  it('should be inverse of angleToSegment', () => {
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    angles.forEach((angle) => {
      const segment = angleToSegment(angle, GRANULARITY);
      const backToAngle = segmentToAngle(segment, GRANULARITY);
      expect(backToAngle).toBeLessThanOrEqual(angle);
      expect(backToAngle).toBeGreaterThanOrEqual(angle - GRANULARITY);
    });
  });
});

describe('filterAlphaJumps', () => {
  it('should return the current alpha for normal small changes', () => {
    expect(filterAlphaJumps(100, 90, 90)).toBe(100);
    expect(filterAlphaJumps(120, 100, 100)).toBe(120);
    expect(filterAlphaJumps(50, 40, 40)).toBe(50);
  });

  it('should return the current alpha when prevAlpha is 0', () => {
    expect(filterAlphaJumps(100, 0, 0)).toBe(100);
    expect(filterAlphaJumps(200, 0, 0)).toBe(200);
    expect(filterAlphaJumps(350, 0, 0)).toBe(350);
  });

  it('should filter out when alpha becomes 0 from a non-zero value (sensor reset)', () => {
    expect(filterAlphaJumps(0, 100, 100)).toBe(100);
    expect(filterAlphaJumps(0, 50, 50)).toBe(50);
    expect(filterAlphaJumps(0, 350, 350)).toBe(350);
  });

  it('should return 0 when alpha is 0 and prevAlpha is also 0', () => {
    expect(filterAlphaJumps(0, 0, 0)).toBe(0);
  });

  it('should filter out jumps greater than MAX_ALPHA_JUMP (50 degrees)', () => {
    expect(filterAlphaJumps(160, 100, 100)).toBe(100);
    expect(filterAlphaJumps(200, 100, 100)).toBe(100);
    expect(filterAlphaJumps(50, 200, 200)).toBe(200);
  });

  it('should allow jumps exactly at MAX_ALPHA_JUMP threshold', () => {
    expect(filterAlphaJumps(150, 100, 100)).toBe(150);
    expect(filterAlphaJumps(100, 150, 150)).toBe(100);
  });

  it('should allow jumps slightly below MAX_ALPHA_JUMP', () => {
    expect(filterAlphaJumps(149, 100, 100)).toBe(149);
    expect(filterAlphaJumps(51, 100, 100)).toBe(51);
  });

  it('should filter out jumps slightly above MAX_ALPHA_JUMP', () => {
    expect(filterAlphaJumps(151, 100, 100)).toBe(100);
    expect(filterAlphaJumps(49, 100, 100)).toBe(100);
  });

  it('should handle wrap-around at 0/360 boundary correctly', () => {
    expect(filterAlphaJumps(10, 350, 350)).toBe(10);
    expect(filterAlphaJumps(350, 10, 10)).toBe(350);
    expect(filterAlphaJumps(70, 350, 350)).toBe(350);
    expect(filterAlphaJumps(290, 10, 10)).toBe(10);
  });

  it('should use the shortest angular path when calculating difference', () => {
    expect(filterAlphaJumps(40, 350, 350)).toBe(40);
    expect(filterAlphaJumps(350, 40, 40)).toBe(350);
    expect(filterAlphaJumps(40, 340, 340)).toBe(340);
    expect(filterAlphaJumps(340, 20, 20)).toBe(340);
  });

  it('should handle 180-degree jumps correctly (maximum possible angular difference)', () => {
    expect(filterAlphaJumps(180, 0, 0)).toBe(180);
    expect(filterAlphaJumps(270, 90, 90)).toBe(90);
  });

  it('should return the filtered alpha even when it differs from prevAlpha', () => {
    expect(filterAlphaJumps(300, 200, 100)).toBe(100);
    expect(filterAlphaJumps(50, 200, 50)).toBe(50);
  });

  it('should handle consecutive small changes that stay within threshold', () => {
    let prevAlpha = 100;
    let filteredAlpha = 100;

    prevAlpha = 120;
    filteredAlpha = filterAlphaJumps(prevAlpha, 100, 100);
    expect(filteredAlpha).toBe(120);

    prevAlpha = 140;
    filteredAlpha = filterAlphaJumps(prevAlpha, 120, filteredAlpha);
    expect(filteredAlpha).toBe(140);

    prevAlpha = 160;
    filteredAlpha = filterAlphaJumps(prevAlpha, 140, filteredAlpha);
    expect(filteredAlpha).toBe(160);
  });

  it('should filter consecutive anomalous jumps', () => {
    let prevAlpha = 100;
    let filteredAlpha = 100;

    prevAlpha = 200;
    filteredAlpha = filterAlphaJumps(prevAlpha, 100, filteredAlpha);
    expect(filteredAlpha).toBe(100);

    prevAlpha = 300;
    filteredAlpha = filterAlphaJumps(prevAlpha, 200, filteredAlpha);
    expect(filteredAlpha).toBe(100);
  });

  it('should accept valid changes after filtering an anomalous jump', () => {
    let prevAlpha = 100;
    let filteredAlpha = 100;

    prevAlpha = 200;
    filteredAlpha = filterAlphaJumps(prevAlpha, 100, filteredAlpha);
    expect(filteredAlpha).toBe(100);

    prevAlpha = 220;
    filteredAlpha = filterAlphaJumps(prevAlpha, 200, filteredAlpha);
    expect(filteredAlpha).toBe(220);
  });
});
