import { Severity } from './common';
import { MonkEntity, MonkEntityType } from './entity';
import { VehiclePart } from './part';

/**
 * Enumeration of the possible objects a severity result can be related to.
 */
export enum SeverityResultTargetType {
  /**
   * A vehcile part.
   */
  PART = 'part',
  /**
   * A damage.
   */
  DAMAGE = 'damage',
  /**
   * A comment on a severity.
   */
  COMMENT = 'comment',
}

/**
 * The details about the operations needed to repair a damage part.
 */
export interface RepairOperation {
  /**
   * Estimation (in hours) of the labour (level 1) needed for the reparation.
   */
  t1?: number;
  /**
   * Estimation (in hours) of the labour (level 2) needed for the reparation.
   */
  t2?: number;
  /**
   * Estimation (in hours) of the paint job needed for the reparation.
   */
  paint?: number;
  /**
   * Indicates if the part needs to be replaced or not.
   */
  replace?: boolean;
  /**
   * Indicates if additional repairs are needed.
   */
  additional?: boolean;
}

/**
 * A severity result value manually written by the user.
 */
export interface CustomSeverityValue {
  /**
   * The comment added by the user when creating this severity result.
   */
  comment?: string;
  /**
   * The severity level of the damage.
   */
  level?: Severity;
  /**
   * The cost of the reparation.
   */
  pricing?: number;
  /**
   * The operation needed to repair the part if it is damaged.
   */
  repairOperation?: RepairOperation;
}

/**
 * Details about a severity (severity level and pricing) of an item (damage or part).
 */
export interface SeverityResult extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.SEVERITY_RESULT;
  /**
   * The ID of the inspection associated with this severity result.
   */
  inspectionId: string;
  /**
   * The severity result value.
   */
  value?: CustomSeverityValue;
  /**
   * Boolean indicating if the user has modified this result or not.
   */
  isUserModified: boolean;
  /**
   * The ID of the item (damage or part) related to this severity result.
   */
  relatedItemId?: string;
  /**
   * The type of the item related to this severity result.
   */
  relatedItemType?: SeverityResultTargetType;
  /**
   * The name of the vehicle part related to this severity result if it is related to one.
   */
  label?: VehiclePart;
}
