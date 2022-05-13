import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { CreateOneViewResponse, DeleteOneViewResponse } from './apiTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the view entity.
 */
export interface ViewPayloadTypes extends EntityReducerPayloadTypes {
  /**
   * The payload type for the views/gotOne action.
   */
  UpdatedOne: CreateOneViewResponse,
  /**
   * The payload type for the views/deletedOne action.
   */
  DeletedOne: DeleteOneViewResponse,
}
