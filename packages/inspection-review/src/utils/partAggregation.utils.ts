import { VehiclePart } from '@monkvision/types';

/**
 * Configuration for a parent part that aggregates multiple child parts, unselectable
 * in the Vehicle360 wireframe.
 *
 * Useful when multiple physical parts (e.g. Rim and Hubcap) should be
 * represented as a single part (e.g. Wheel) in the Damages section, summing up their damages and pricing.
 */
export interface PartAggregationConfig {
  /**
   * The parent part that represents the aggregation, selectable in the Vehicle360 wireframe.
   */
  parent: VehiclePart;
  /**
   * The child parts that should be aggregated into the parent, unselectable in the Vehicle360 wireframe.
   */
  children: VehiclePart[];
}

/**
 * Mapping of wheel parts to their corresponding rim and hubcap parts.
 *
 * E.g. Each wheel aggregates damages and pricing from its rim and hubcap.
 */
export const WHEEL_PART_AGGREGATIONS: PartAggregationConfig[] = [
  {
    parent: VehiclePart.WHEEL_FRONT_LEFT,
    children: [VehiclePart.RIM_FRONT_LEFT, VehiclePart.HUBCAP_FRONT_LEFT],
  },
  {
    parent: VehiclePart.WHEEL_FRONT_RIGHT,
    children: [VehiclePart.RIM_FRONT_RIGHT, VehiclePart.HUBCAP_FRONT_RIGHT],
  },
  {
    parent: VehiclePart.WHEEL_BACK_LEFT,
    children: [VehiclePart.RIM_BACK_LEFT, VehiclePart.HUBCAP_BACK_LEFT],
  },
  {
    parent: VehiclePart.WHEEL_BACK_RIGHT,
    children: [VehiclePart.RIM_BACK_RIGHT, VehiclePart.HUBCAP_BACK_RIGHT],
  },
];

/**
 * All part aggregation configurations.
 */
export const PART_AGGREGATIONS: PartAggregationConfig[] = [...WHEEL_PART_AGGREGATIONS];

/**
 * Get all child parts that should be aggregated into a parent part.
 */
export function getChildPartsForAggregation(parentPart: VehiclePart): VehiclePart[] {
  const config = PART_AGGREGATIONS.find((agg) => agg.parent === parentPart);
  return config?.children ?? [];
}

/**
 * Check if a part is a child part that should be aggregated into a parent.
 */
export function isChildPartForAggregation(part: VehiclePart): boolean {
  return PART_AGGREGATIONS.some((agg) => agg.children.includes(part));
}

/**
 * Get the parent part for a given child part, if it exists.
 */
export function getParentPartForChild(part: VehiclePart): VehiclePart | null {
  const config = PART_AGGREGATIONS.find((agg) => agg.children.includes(part));
  return config?.parent ?? null;
}

/**
 * Check if a part is a parent part that aggregates other child parts.
 */
export function isParentPartForAggregation(part: VehiclePart): boolean {
  return PART_AGGREGATIONS.some((agg) => agg.parent === part);
}
