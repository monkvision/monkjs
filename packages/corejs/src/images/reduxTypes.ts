import { EntityReducerPayloadTypes, GotOneEntityPayload } from '../createEntityReducer';
import { NormalizedImage } from './entityTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the image entity.
 */
export interface ImagePayloadTypes extends EntityReducerPayloadTypes<NormalizedImage> {
  /**
   * The payload type for the images/gotOne action.
   */
  GotOne: GotOneImagePayload,
}

/**
 * The payload type for the images/gotOne action.
 */
export interface GotOneImagePayload extends GotOneEntityPayload<NormalizedImage> {
  /**
   * The id (uuid) of the inspection entity related to the image.
   */
  inspectionId: string,
}
