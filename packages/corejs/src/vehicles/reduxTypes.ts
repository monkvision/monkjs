import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { UpdateOneVehicleResponse } from './apiTypes';
import { NormalizedVehicle } from './entityTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the vehicle entity.
 */
export interface VehiclePayloadTypes extends EntityReducerPayloadTypes<NormalizedVehicle> {
  /**
   * The payload type for the vehicles/updatedOne action.
   */
  UpdatedOne: UpdateOneVehicleResponse,
}
