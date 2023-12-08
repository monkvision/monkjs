import { MonkEntity, MonkEntityType } from './entity';

/**
 * Details of specific damage on a specific part.
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
  type: string;
  /**
   * The ID of the vehicle parts that this damage is on.
   */
  parts: string[];
  /**
   * The size of the damage (in cm).
   */
  size?: number;
  /**
   * The IDs of the images related to this damage.
   */
  relatedImages?: string[];
}
