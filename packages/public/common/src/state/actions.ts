import { MonkState } from './state';

/**
 * Enumeration of the types of action that can be dispatched in the Monk state.
 */
export enum MonkActionType {
  /**
   * Update the state.
   */
  UPDATE_STATE = 'update_state',
  /**
   * Reset the state.
   */
  RESET_STATE = 'reset_state',
}

/**
 * Type definition for a generic action dispatched in the Monk state.
 */
export interface MonkAction {
  /**
   * The type of the action.
   */
  type: MonkActionType;
}

/**
 * The payload of a MonkUpdateStateAction.
 */
export interface MonkUpdateStatePayload {
  /**
   * The new entities to add to the state. For each entity, if an entity with the same ID already exist in the state,
   * overwrite it.
   */
  entities?: Partial<MonkState>;
  /**
   * A list of entity IDs to delete from the state.
   */
  deleted?: string[];
}

/**
 * Action dispatched when an update to the state needs to be made.
 */
export interface MonkUpdateStateAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.UPDATE_STATE`.
   */
  type: MonkActionType.UPDATE_STATE;
  /**
   * The payload of the action containing the new entities or the IDs of the deleted ones.
   */
  payload: MonkUpdateStatePayload;
}

/**
 * Matcher function that matches a MonkGotOneAction while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isUpdateStateAction(action: MonkAction): action is MonkUpdateStateAction {
  return action.type === MonkActionType.UPDATE_STATE;
}

/**
 * Action dispatched when the state needs to be reset.
 */
export interface MonkResetStateAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.UPDATE_STATE`.
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
