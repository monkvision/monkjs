import { MonkAction, MonkActionType } from './monkAction';
import { createEmptyMonkState, MonkState } from '../state';

/**
 * Action dispatched when the state needs to be reset.
 */
export interface MonkResetStateAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.RESET_STATE`.
   */
  type: MonkActionType.RESET_STATE;
}

/**
 * Matcher function that matches a MonkGotOneAction while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isResetStateAction(action: MonkAction): action is MonkResetStateAction {
  return action.type === MonkActionType.RESET_STATE;
}

/**
 * Reducer function for a ResetState action.
 */
export function resetState(): MonkState {
  return createEmptyMonkState();
}
