import { vehicles } from '@monkvision/sights';
import { VehicleType, VehicleModel } from '@monkvision/types';

/**
 * Returns the vehicle model corresponding to the given vehicle type.
 */
export function getVehicleModel(vehicleType: VehicleType): VehicleModel {
  const ajustedVehicletype = vehicleType === VehicleType.SUV ? VehicleType.CUV : vehicleType;
  const detail = Object.entries(vehicles)
    .filter(([type]) => type !== VehicleModel.AUDIA7)
    .find(([, details]) => details.type === ajustedVehicletype)?.[1];
  if (detail === undefined) {
    throw new Error(`No vehicle model found for vehicle type ${ajustedVehicletype}`);
  }
  return detail.id;
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
 * Converts an angle to a segment index based on a given granularity.
 *
 * @param angle - The angle in degrees.
 * @param degreeGranularity - The size of each segment in degrees.
 * @returns The segment index (0-based).
 */
export function angleToSegment(angle: number, degreeGranularity: number): number {
  return Math.floor(normalizeAngle(angle) / degreeGranularity);
}

/**
 * Converts a segment index to its starting angle based on a given granularity.
 *
 * @param segment - The segment index (0-based).
 * @param degreeGranularity - The size of each segment in degrees.
 * @returns The starting angle of the segment in degrees.
 */
export function segmentToAngle(segment: number, degreeGranularity: number): number {
  return segment * degreeGranularity;
}
