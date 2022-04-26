/**
 * Application entity representing damage spotted on the car during an inspection.
 */
export interface Damage {
  /**
   * The id (uuid) of the damage entity.
   */
  id: string;
  /**
   * Creation date of the damage entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Deletion date of the damage entity (if it has been deleted), in the ISO 8601 format.
   */
  deletedAt?: string;
  /**
   * Type of damage.
   */
  damageType?: DamageType;
  /**
   * The id (uuid) of the user that created this damage entity.
   */
  createdBy?: string;
  /**
   * The id (uuid) of the inspection in which this damage has been found.
   */
  inspectionId?: string;
  /**
   * The ids (uuids) of the car parts affected by this damage.
   */
  partIds?: string[];
}

/**
 * Normalized application entity representing damage spotted on the car during an inspection.
 */
export type NormalizedDamage = Damage;

/**
 * Different type of damage our system supports.
 *
 * *Swagger Schema Reference :* `ReservedDamagesNames`
 */
export enum DamageType {
  BODY_CRACK = 'body_crack',
  BROKEN_GLASS = 'broken_glass',
  BROKEN_LIGHT = 'broken_light',
  DENT = 'dent',
  DIRT = 'dirt',
  HUBCAP_SCRATCH = 'hubcap_scratch',
  MISSHAPE = 'misshape',
  MISSING_HUBCAP = 'missing_hubcap',
  MISSING_PIECE = 'missing_piece',
  PAINT_PEELING = 'paint_peeling',
  RUSTINESS = 'rustiness',
  SCATTERED_SCRATCHES = 'scattered_scratches',
  SCRATCH = 'scratch',
  SMASH = 'smash',
  LIGHT_REFLECTION = 'light_reflection',
  SHADOW = 'shadow',
  CAR_CURVE = 'car_curve',
}
