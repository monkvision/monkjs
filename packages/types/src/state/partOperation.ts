import { Severity } from './common';
import { MonkEntity, MonkEntityType } from './entity';

/**
 * Details about the operation needed to repair a damage on a part.
 */
export interface PartOperation extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.PART_OPERATION;
  /**
   * The name of the repair operation.
   */
  name?: string;
  /**
   * The severity of the damage on the part.
   */
  severity?: Severity;
  /**
   * The cost of the replacement pieces if the part needs replacement.
   */
  piecesOEMCost?: number;
  /**
   * The total cost of the reparation.
   */
  totalCost?: number;
}
