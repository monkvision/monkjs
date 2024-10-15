import { AdditionalData } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkUpdatedOneInspectionAdditionalDataPayload.
 */
export interface MonkUpdatedOneInspectionAdditionalDataPayload {
  /**
   * The ID of the inspection to which the pricing was updated.
   */
  inspectionId: string;
  /**
   * Additional data used for the update operation.
   */
  additionalData?: AdditionalData;
}

/**
 * Action dispatched when a inspection have been updated.
 */
export interface MonkUpdatedOneInspectionAdditionalDataAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA`.
   */
  type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkUpdatedOneInspectionAdditionalDataPayload;
}

/**
 * Matcher function that matches a UpdatedOneInspection while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isUpdatedOneInspectionAdditionalDataAction(
  action: MonkAction,
): action is MonkUpdatedOneInspectionAdditionalDataAction {
  return action.type === MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA;
}

/**
 * Reducer function for a UpdatedOneInspection action.
 */
export function updatedOneInspectionAdditionalData(
  state: MonkState,
  action: MonkUpdatedOneInspectionAdditionalDataAction,
): MonkState {
  const { inspections } = state;
  const { payload } = action;

  const inspection = inspections.find((value) => value.id === payload.inspectionId);
  if (inspection) {
    inspection.additionalData = payload.additionalData;
  }
  return {
    ...state,
    inspections: [...inspections],
  };
}
