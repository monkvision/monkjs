import { EntityReducerPayloadTypes } from '../createEntityReducer';
import { NormalizedWheelAnalysis } from './entityTypes';

/**
 * A type-mapping interface that defines the types of the action payload related to the wheel analysis entity.
 */
export type WheelAnalysisPayloadTypes = EntityReducerPayloadTypes<NormalizedWheelAnalysis>;
