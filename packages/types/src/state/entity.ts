/**
 * Enumeration of the entities defined and used in MonkJs projects. An entity is an object with a unique ID (UUIDv4),
 * that is stored by our back-end and that can usually be fetched.
 */
export enum MonkEntityType {
  DAMAGE = 'damage',
  IMAGE = 'image',
  INSPECTION = 'inspection',
  PART = 'part',
  PART_OPERATION = 'partOperation',
  SEVERITY_RESULT = 'severityResult',
  TASK = 'task',
  VEHICLE = 'vehicle',
  WHEEL_ANALYSIS = 'wheel_analysis',
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
