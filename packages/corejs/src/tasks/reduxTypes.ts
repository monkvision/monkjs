import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { GetManyTasksResponse, GetOneTaskResponse, UpdateOneTaskResponse } from './apiTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the image entity.
 */
export interface TaskPayloadTypes extends EntityReducerPayloadTypes {
  /**
   * The payload type for the tasks/gotOne action.
   */
  GotOne: GetOneTaskResponse,
  /**
   * The payload type for the tasks/gotMany action.
   */
  GotMany: GetManyTasksResponse,
  /**
   * The payload type for the tasks/updatedOne action.
   */
  UpdatedOne: UpdateOneTaskResponse,
}
