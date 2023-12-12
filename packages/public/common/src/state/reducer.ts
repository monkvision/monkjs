import { MonkEntity } from '@monkvision/types';
import {
  isResetStateAction,
  isUpdateStateAction,
  MonkAction,
  MonkUpdateStatePayload,
} from './actions';
import { createEmptyMonkState, MonkState } from './state';

function updateState(state: MonkState, payload: MonkUpdateStatePayload): MonkState {
  const newState = createEmptyMonkState();
  Object.keys(state).forEach((key: string) => {
    const entityKey = key as keyof MonkState;
    state[entityKey].forEach((stateEntity) => {
      if (!payload.deleted || !payload.deleted.includes(stateEntity.id)) {
        (newState[entityKey] as MonkEntity[]).push(stateEntity);
      }
    });
    if (payload.entities) {
      payload.entities[entityKey]?.forEach((payloadEntity) => {
        if (payload.deleted && payload.deleted.includes(payloadEntity.id)) {
          return;
        }
        const newEntityIndex = newState[entityKey].findIndex(
          (newEntity) => newEntity.id === payloadEntity.id,
        );
        if (newEntityIndex !== -1) {
          (newState[entityKey] as MonkEntity[])[newEntityIndex] = payloadEntity;
        } else {
          (newState[entityKey] as MonkEntity[]).push(payloadEntity);
        }
      });
    }
  });
  return newState;
}

/**
 * Main reducer function for the Monk state.
 */
export function monkReducer(state: MonkState, action: MonkAction): MonkState {
  if (isResetStateAction(action)) {
    return createEmptyMonkState();
  }
  if (isUpdateStateAction(action)) {
    return updateState(state, action.payload);
  }
  return state;
}
