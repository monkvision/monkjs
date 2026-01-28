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

/**
 * Interface representing an interior damage item.
 */
export interface InteriorDamage {
  /**
   * The area of the interior where the damage is located.
   */
  area: string;
  /**
   * The type of damage.
   */
  damage_type: string;
  /**
   * The estimated repair cost for the damage.
   */
  repair_cost: number | null;
}

/**
 * Interface representing selected interior damage data along with its index in other_damages list.
 */
export interface SelectedInteriorDamageData {
  /**
   * The index of the damage in the other_damages list.
   */
  index: number;
  /**
   * The interior damage details.
   */
  damage: InteriorDamage;
}
