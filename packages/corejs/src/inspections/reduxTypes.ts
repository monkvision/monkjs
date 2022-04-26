import { EntityReducerPayloadTypes } from '../createEntityReducer';
import {
  CreateOneInspectionResponse,
  DeleteOneInspectionResponse,
  GetManyInspectionsResponse,
  GetOneInspectionResponse,
} from './apiTypes';
import { NormalizedInspection } from './entityTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the inspection entity.
 */
export interface InspectionPayloadTypes extends EntityReducerPayloadTypes<NormalizedInspection> {
  /**
   * The payload type for the inspections/gotOne action.
   */
  GotOne: GetOneInspectionResponse,
  /**
   * The payload type for the inspections/gotMany action.
   */
  GotMany: GetManyInspectionsResponse,
  /**
   * The payload type for the inspections/updatedOne action.
   */
  UpdatedOne: CreateOneInspectionResponse,
  /**
   * The payload type for the inspections/deletedOne action.
   */
  DeletedOne: DeleteOneInspectionResponse,
}
