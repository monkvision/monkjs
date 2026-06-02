import { VehicleModel, VehicleType } from '@monkvision/types';
import {
  getVehicleModel,
  normalizeAngle,
  getAngleDifference,
  angleToSegment,
  segmentToAngle,
} from '../../src';

describe('getVehicleModel', () => {
  it('should return the correct vehicle model for a given vehicle type', () => {
    const vehicleType = VehicleType.PICKUP;
    const expectedModel = VehicleModel.FF150;
    expect(getVehicleModel(vehicleType)).toBe(expectedModel);
  });

  it('should return the correct vehicle model for SUV type', () => {
    const vehicleType = VehicleType.SUV;
    const expectedModel = VehicleModel.FESC20;
    expect(getVehicleModel(vehicleType)).toBe(expectedModel);
  });

  it('should return the correct vehicle model for CUV type', () => {
    const vehicleType = VehicleType.CUV;
    const expectedModel = VehicleModel.FESC20;
    expect(getVehicleModel(vehicleType)).toBe(expectedModel);
  });

  it('should throw an error if no vehicle model is found', () => {
    const vehicleType = VehicleType.HATCHBACK;
    expect(() => getVehicleModel(vehicleType)).toThrow(
      `No vehicle model found for vehicle type ${vehicleType}`,
    );
  });
});

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
