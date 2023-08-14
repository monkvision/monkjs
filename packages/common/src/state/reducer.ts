import { MonkEntity, MonkEntityType } from '@monkvision/types';
import {
  isDeletedManyAction,
  isDeletedOneAction,
  isGotManyAction,
  isGotOneAction,
  MonkAction,
  MonkDeletedManyAction,
  MonkDeletedOneAction,
  MonkGotManyAction,
  MonkGotOneAction,
} from './actions';
import { MonkState } from './state';

function createOrUpdateEntity<E extends MonkEntity>(state: E[], entity: E): E[] {
  const index = state.findIndex((e) => e.id === entity.id);
  const newState = [...state];
  if (index >= 0) {
    newState[index] = entity;
  } else {
    newState.push(entity);
  }
  return newState;
}

function gotOne<E extends MonkEntity>(state: E[], action: MonkGotOneAction<E>): E[] {
  return createOrUpdateEntity<E>(state, action.entity);
}

function gotMany<E extends MonkEntity>(state: E[], action: MonkGotManyAction<E>): E[] {
  let newState = [...state];
  action.entities.forEach((entity) => {
    newState = createOrUpdateEntity<E>(newState, entity);
  });
  return newState;
}

function deletedOne<E extends MonkEntity>(state: E[], action: MonkDeletedOneAction): E[] {
  return state.filter((entity) => entity.id !== action.id);
}

function deletedMany<E extends MonkEntity>(state: E[], action: MonkDeletedManyAction): E[] {
  return state.filter((entity) => !action.ids.includes(entity.id));
}

function entityReducer<E extends MonkEntity>(
  state: E[],
  action: MonkAction,
  entityType: MonkEntityType,
): E[] {
  if (action.entityType !== entityType) {
    return state;
  }
  if (isGotOneAction<E>(action)) {
    return gotOne(state, action);
  }
  if (isGotManyAction<E>(action)) {
    return gotMany(state, action);
  }
  if (isDeletedOneAction(action)) {
    return deletedOne(state, action);
  }
  if (isDeletedManyAction(action)) {
    return deletedMany(state, action);
  }
  return state;
}

/**
 * Main reducer function for the Monk state.
 */
export function monkReducer(state: MonkState, action: MonkAction): MonkState {
  return {
    damages: entityReducer(state.damages, action, MonkEntityType.DAMAGE),
    images: entityReducer(state.images, action, MonkEntityType.IMAGE),
    inspections: entityReducer(state.inspections, action, MonkEntityType.INSPECTION),
    parts: entityReducer(state.parts, action, MonkEntityType.PART),
    partOperations: entityReducer(state.partOperations, action, MonkEntityType.PART_OPERATION),
    severityResults: entityReducer(state.severityResults, action, MonkEntityType.SEVERITY_RESULT),
    tasks: entityReducer(state.tasks, action, MonkEntityType.TASK),
    vehicles: entityReducer(state.vehicles, action, MonkEntityType.VEHICLE),
    wheelAnalysis: entityReducer(state.wheelAnalysis, action, MonkEntityType.WHEEL_ANALYSIS),
  };
}
