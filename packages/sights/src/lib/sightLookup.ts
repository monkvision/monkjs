import { Sight, VehicleModel } from '@monkvision/types';
import { labels, sights } from './data';

/**
 * The result of resolving a single human-readable sight name into sight IDs for a given vehicle model.
 */
export type SightNameLookupResult =
  | {
      /**
       * The original name provided as input.
       */
      input: string;
      /**
       * The label dictionary key matched from the input.
       */
      labelKey: string;
      /**
       * The sight IDs matching this label for the requested vehicle model. Can contain more than one entry when the
       * label is ambiguous for this vehicle (e.g. a standard sight and a dev/close-up variant sharing the same
       * label).
       */
      sightIds: string[];
      /**
       * Whether more than one sight ID was found for this label and vehicle model.
       */
      ambiguous: boolean;
      error?: undefined;
    }
  | {
      /**
       * The original name provided as input.
       */
      input: string;
      /**
       * The reason no sight ID could be resolved for this input.
       *
       * - `unknown-label` : the normalized input does not match any known label dictionary key.
       * - `no-sight-for-vehicle` : the label exists, but no sight uses it for the requested vehicle model.
       */
      error: 'unknown-label' | 'no-sight-for-vehicle';
      labelKey?: string;
    };

/**
 * The result of resolving a single sight ID into its label information.
 */
export type SightIdLookupResult =
  | {
      /**
       * The sight ID provided as input.
       */
      sightId: string;
      /**
       * The label dictionary key of this sight.
       */
      labelKey: string;
      /**
       * The English translation of this sight's label.
       */
      englishLabel: string;
      error?: undefined;
    }
  | {
      /**
       * The sight ID provided as input.
       */
      sightId: string;
      /**
       * The reason no label could be resolved for this input.
       *
       * - `unknown-sight-id` : no sight with this ID exists in the sights dictionary.
       * - `unknown-label-key` : the sight exists, but its label key has no entry in the labels dictionary.
       */
      error: 'unknown-sight-id' | 'unknown-label-key';
    };

/**
 * Normalizes a human-readable sight name into the slug format used by label dictionary keys : lower-cased, trimmed,
 * with whitespace replaced by hyphens.
 *
 * @example normalizeLabelInput('Front low') // 'front-low'
 */
export function normalizeLabelInput(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

/**
 * Finds the label dictionary key matching a human-readable sight name, if any. The input is normalized (see
 * `normalizeLabelInput`) and matched directly against the label dictionary keys, which are themselves slugs derived
 * from their English translation (e.g. `front-low`).
 */
export function getLabelKeyFromName(name: string): string | undefined {
  const normalized = normalizeLabelInput(name);
  return normalized in labels ? normalized : undefined;
}

/**
 * Returns every sight ID using the given label key for the given vehicle model. A label can be used by more than one
 * sight of the same vehicle model (e.g. a standard sight and a dev/close-up variant), in which case every matching
 * ID is returned.
 */
export function getSightIdsByLabelForVehicle(labelKey: string, vehicleModel: VehicleModel): string[] {
  return Object.values(sights as Record<string, Sight>)
    .filter((sight) => sight.vehicle === vehicleModel && sight.label === labelKey)
    .map((sight) => sight.id);
}

/**
 * Resolves an ordered list of human-readable sight names into their corresponding sight IDs for a given vehicle
 * model. Every input is resolved independently and in order, never throwing : unmatched or ambiguous names are
 * reported in the result instead of being guessed, so that the caller can surface them for clarification.
 */
export function resolveSightIdsFromNames(
  names: string[],
  vehicleModel: VehicleModel,
): SightNameLookupResult[] {
  return names.map((input) => {
    const labelKey = getLabelKeyFromName(input);
    if (!labelKey) {
      return { input, error: 'unknown-label' };
    }
    const sightIds = getSightIdsByLabelForVehicle(labelKey, vehicleModel);
    if (sightIds.length === 0) {
      return { input, labelKey, error: 'no-sight-for-vehicle' };
    }
    return { input, labelKey, sightIds, ambiguous: sightIds.length > 1 };
  });
}

/**
 * Returns the label dictionary key of a sight, if the sight ID exists.
 */
export function getLabelKeyForSightId(sightId: string): string | undefined {
  return (sights as Record<string, Sight>)[sightId]?.label;
}

/**
 * Returns the English translation of a sight's label, if the sight ID exists and its label has a matching entry in
 * the label dictionary.
 */
export function getEnglishLabelForSightId(sightId: string): string | undefined {
  const labelKey = getLabelKeyForSightId(sightId);
  return labelKey ? labels[labelKey]?.en : undefined;
}

/**
 * Resolves an ordered list of sight IDs into their label information (label key and English translation). Every
 * input is resolved independently and in order, never throwing : unknown sight IDs or label keys are reported in the
 * result instead.
 */
export function resolveNamesFromSightIds(sightIds: string[]): SightIdLookupResult[] {
  return sightIds.map((sightId) => {
    const labelKey = getLabelKeyForSightId(sightId);
    if (!labelKey) {
      return { sightId, error: 'unknown-sight-id' };
    }
    const englishLabel = labels[labelKey]?.en;
    if (!englishLabel) {
      return { sightId, error: 'unknown-label-key' };
    }
    return { sightId, labelKey, englishLabel };
  });
}
