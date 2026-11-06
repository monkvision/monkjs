import { VehicleType } from '@monkvision/types';
import { flatten } from '@monkvision/common';
import { sights } from '@monkvision/sights';

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
): string | undefined {
  if (!value) {
    return undefined;
  }
  const sightIds = Array.isArray(value) ? value : Object.keys(value);
  const invalidIds = sightIds.filter((sightId) => !isValidSightId(sightId)).join(', ');
  const plural = invalidIds.length > 1 ? 's' : '';
  return `Invalid sight ID${plural} : ${invalidIds}`;
}

/**
 * Zod refinement params reporting the invalid sight IDs found in the validated value.
 */
export const invalidSightIdsError = {
  error: (issue: { input?: unknown }) =>
    getInvalidSightIdsMessage(issue.input as string[] | Record<string, unknown> | undefined),
};
