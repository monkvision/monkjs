import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { CreateOneDamageResponse, DeleteOneDamageResponse } from './apiTypes';
import { NormalizedDamage } from './entityTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the image entity.
 */
export interface DamagePayloadTypes extends EntityReducerPayloadTypes<NormalizedDamage> {
  /**
   * The payload type for the damages/updatedOne action.
   */
  UpdatedOne: CreateOneDamageResponse,
  /**
   * The payload type for the damages/deletedOne action.
   */
  DeletedOne: DeleteOneDamageResponse,
}
