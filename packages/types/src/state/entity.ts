/**
 * Enumeration of the entities defined and used in MonkJs projects. An entity is an object with a unique ID (UUIDv4),
 * that is stored by our back-end and that can usually be fetched.
 */
export enum MonkEntityType {
  DAMAGE = 'DAMAGE',
  IMAGE = 'IMAGE',
  INSPECTION = 'INSPECTION',
  PART = 'PART',
  PART_OPERATION = 'PART_OPERATION',
  RENDERED_OUTPUT = 'RENDERED_OUTPUT',
  SEVERITY_RESULT = 'SEVERITY_RESULT',
  TASK = 'TASK',
  VEHICLE = 'VEHICLE',
  VIEW = 'VIEW',
  PRICING = 'PRICING',
}

/**
 * Interface describing the common fields that are shared by every entity defined in MonkJs.
 */
export interface MonkEntity {
  /**
   * The ID (UUID v4) of the entity.
   */
  id: string;
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType;
}
