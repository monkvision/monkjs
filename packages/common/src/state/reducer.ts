import {
  createdOneImage,
  gotOneInspection,
  isCreatedOneImageAction,
  isGotOneInspectionAction,
  isResetStateAction,
  isUpdatedManyTasksAction,
  isCreatedOnePricingAction,
  isDeletedOnePricingAction,
  isUpdatedOnePricingAction,
  isUpdatedOneInspectionAdditionalDataAction,
  isUpdatedVehicleAction,
  isCreatedOneDamageAction,
  isDeletedOneDamageAction,
  isGotOneInspectionPdfAction,
  isDeletedOneImageAction,
  isUpdatedOneImageAdditionalDataAction,
  MonkAction,
  resetState,
  updatedManyTasks,
  createdOnePricing,
  deletedOnePricing,
  updatedOnePricing,
  updatedOneInspectionAdditionalData,
  updatedVehicle,
  createdOneDamage,
  deletedOneDamage,
  gotOneInspectionPdf,
  deletedOneImage,
  updatedOneImageAdditionalData,
} from './actions';
import { MonkState } from './state';

/**
 * Main reducer function for the Monk state.
 */
export function monkReducer(state: MonkState, action: MonkAction): MonkState {
  if (isResetStateAction(action)) {
    return resetState();
  }
  if (isGotOneInspectionAction(action)) {
    return gotOneInspection(state, action);
  }
  if (isUpdatedOneInspectionAdditionalDataAction(action)) {
    return updatedOneInspectionAdditionalData(state, action);
  }
  if (isCreatedOneImageAction(action)) {
    return createdOneImage(state, action);
  }
  if (isDeletedOneImageAction(action)) {
    return deletedOneImage(state, action);
  }
  if (isUpdatedManyTasksAction(action)) {
    return updatedManyTasks(state, action);
  }
  if (isCreatedOnePricingAction(action)) {
    return createdOnePricing(state, action);
  }
  if (isDeletedOnePricingAction(action)) {
    return deletedOnePricing(state, action);
  }
  if (isUpdatedOnePricingAction(action)) {
    return updatedOnePricing(state, action);
  }
  if (isUpdatedVehicleAction(action)) {
    return updatedVehicle(state, action);
  }
  if (isCreatedOneDamageAction(action)) {
    return createdOneDamage(state, action);
  }
  if (isDeletedOneDamageAction(action)) {
    return deletedOneDamage(state, action);
  }
  if (isGotOneInspectionPdfAction(action)) {
    return gotOneInspectionPdf(state, action);
  }
  if (isUpdatedOneImageAdditionalDataAction(action)) {
    return updatedOneImageAdditionalData(state, action);
  }
  return state;
}
