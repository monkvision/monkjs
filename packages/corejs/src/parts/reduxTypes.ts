import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { NormalizedPart } from './entityTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the part entity.
 */
export type PartPayloadTypes = EntityReducerPayloadTypes<NormalizedPart>;
