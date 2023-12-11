import { MonkEntity, MonkEntityType } from './entity';

/**
 * Enumeration of the types of damages that the models can detect.
 */
export enum DamageType {
  SCRATCH = 'scratch',
  DENT = 'dent',
  BROKEN_GLASS = 'broken_glass',
  BROKEN_LIGHT = 'broken_light',
  HUBCAP_SCRATCH = 'hubcap_scratch',
  MISSING_HUBCAP = 'missing_hubcap',
  SMASH = 'smash',
  BODY_CRACK = 'body_crack',
  MISSING_PIECE = 'missing_piece',
  RUSTINESS = 'rustiness',
}

/**
 * Details of damage detected during the inspection
 */
export interface Damage extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.DAMAGE;
  /**
   * The ID of the inspection associated with this damage.
   */
  inspectionId: string;
  /**
   * The type of the damage.
   */
  type: DamageType;
  /**
   * The size of the damage (in cm).
   */
  size?: number;
  /**
   * The IDs of the images related to this damage.
   */
  relatedImages: string[];
}
