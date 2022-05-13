import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { UpsertOneDamageAreaResponse } from './apiTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the damage area entity.
 */
export interface DamageAreaPayloadTypes extends EntityReducerPayloadTypes {
  /**
   * The payload type for the damageAreas/updatedOne action.
   */
  UpdatedOne: UpsertOneDamageAreaResponse,
}
