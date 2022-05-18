import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { UpdateOneVehicleResponse } from './apiTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the vehicle entity.
 */
export interface VehiclePayloadTypes extends EntityReducerPayloadTypes {
  /**
   * The payload type for the vehicles/updatedOne action.
   */
  UpdatedOne: UpdateOneVehicleResponse,
}
