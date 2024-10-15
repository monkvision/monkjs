import { PricingV2RelatedItemType, VehiclePart } from '@monkvision/types';

/**
 * Options for part-specific pricing.
 */
export interface PricingPartOptions {
  /**
   * The type of pricing, in this case for a part.
   */
  type: PricingV2RelatedItemType.PART;

  /**
   * The pricing value for the part. Must be a non-negative float.
   */
  pricing: number;

  /**
   * The specific vehicle part this pricing applies to.
   */
  vehiclePart: VehiclePart;
}

/**
 * Options for car-wide pricing.
 */
export interface PricingVehicleOptions {
  /**
   * The type of pricing, in this case for the whole car.
   */
  type: PricingV2RelatedItemType.VEHICLE;

  /**
   * The pricing value for the entire car.
   */
  pricing: number;
}

/**
 * Union type representing pricing options for either a car or a part.
 */
export type PricingOptions = PricingVehicleOptions | PricingPartOptions;
