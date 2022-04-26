import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { CreateOneViewResponse, DeleteOneViewResponse } from './apiTypes';
import { NormalizedView } from './entityTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the view entity.
 */
export interface ViewPayloadTypes extends EntityReducerPayloadTypes<NormalizedView> {
  /**
   * The payload type for the views/gotOne action.
   */
  UpdatedOne: CreateOneViewResponse,
  /**
   * The payload type for the views/deletedOne action.
   */
  DeletedOne: DeleteOneViewResponse,
}
