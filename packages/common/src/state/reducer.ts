import {
  createdOneImage,
  gotOneInspection,
  isCreatedOneImageAction,
  isGotOneInspectionAction,
  isResetStateAction,
  isUpdatedManyTasksAction,
  MonkAction,
  resetState,
  updatedManyTasks,
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
  if (isCreatedOneImageAction(action)) {
    return createdOneImage(state, action);
  }
  if (isUpdatedManyTasksAction(action)) {
    return updatedManyTasks(state, action);
  }
  return state;
}
