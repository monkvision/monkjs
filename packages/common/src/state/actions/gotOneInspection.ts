import { MonkEntity } from '@monkvision/types';
import { MonkState } from '../state';
import { MonkAction, MonkActionType } from './monkAction';

/**
 * Action dispatched when an inspection has been fetched from the API.
 */
export interface MonkGotOneInspectionAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.GOT_ONE_INSPECTION`.
   */
  type: MonkActionType.GOT_ONE_INSPECTION;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: Partial<MonkState>;
}

/**
 * Matcher function that matches a GotOneInspection while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isGotOneInspectionAction(action: MonkAction): action is MonkGotOneInspectionAction {
  return action.type === MonkActionType.GOT_ONE_INSPECTION;
}

/**
 * Reducer function for a GotOneInspection action.
 */
export function gotOneInspection(state: MonkState, action: MonkGotOneInspectionAction): MonkState {
  const newState = { ...state };
  Object.keys(state).forEach((key: string) => {
    const entityKey = key as keyof MonkState;
    action.payload[entityKey]?.forEach((payloadEntity) => {
      const newEntityIndex = state[entityKey].findIndex(
        (newEntity) => newEntity.id === payloadEntity.id,
      );
      if (newEntityIndex !== -1) {
        (newState[entityKey] as MonkEntity[])[newEntityIndex] = payloadEntity;
      } else {
        (newState[entityKey] as MonkEntity[]).push(payloadEntity);
      }
    });
  });
  return newState;
}
