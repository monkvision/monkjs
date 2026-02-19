import { DamageType, VehiclePart } from '@monkvision/types';

/**
 * Details about a vehicle part and its associated damages and pricing.
 */
export interface DamagedPartDetails {
  /**
   * The vehicle part.
   */
  part: VehiclePart;
  /**
   * Indicates if the part is damaged.
   */
  isDamaged: boolean;
  /**
   * Types of damages associated with the part.
   */
  damageTypes: DamageType[];
  /**
   * The pricing associated with the part.
   */
  pricing?: number;
}
