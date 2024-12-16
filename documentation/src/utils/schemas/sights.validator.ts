import { VehicleType } from '@monkvision/types';
import { flatten } from '@monkvision/common';
import { sights } from '@monkvision/sights';
import { CustomErrorParams } from 'zod';

export function getAllSightsByVehicleType(
  vehicleSights?: Partial<Record<VehicleType, string[]>>,
): string[] | undefined {
  return vehicleSights ? flatten(Object.values(vehicleSights)) : undefined;
}

export function isValidSightId(sightId: string): boolean {
  return !!sights[sightId];
}

export function validateSightIds(value?: string[] | Record<string, unknown>): boolean {
  if (!value) {
    return true;
  }
  const sightIds = Array.isArray(value) ? value : Object.keys(value);
  return sightIds.every(isValidSightId);
}

export function getInvalidSightIdsMessage(
  value?: string[] | Record<string, unknown>,
): CustomErrorParams {
  if (!value) {
    return {};
  }
  const sightIds = Array.isArray(value) ? value : Object.keys(value);
  const invalidIds = sightIds.filter((sightId) => !isValidSightId(sightId)).join(', ');
  const plural = invalidIds.length > 1 ? 's' : '';
  return { message: `Invalid sight ID${plural} : ${invalidIds}` };
}
