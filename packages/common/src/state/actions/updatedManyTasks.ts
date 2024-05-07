import { ProgressStatus } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * Details about a task which status has been updated.
 */
export interface UpdatedTask {
  id: string;
  status: ProgressStatus;
}

/**
 * Action dispatched when the status of multiple tasks have been updated.
 */
export interface MonkUpdatedManyTasksAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.UPDATED_ONE_TASK`.
   */
  type: MonkActionType.UPDATED_MANY_TASKS;
  /**
   * The payload of the action.
   */
  payload: UpdatedTask[];
}

/**
 * Matcher function that matches a UpdatedManyTasksAction while also inferring its type using TypeScript's type
 * predicate feature.
 */
export function isUpdatedManyTasksAction(action: MonkAction): action is MonkUpdatedManyTasksAction {
  return action.type === MonkActionType.UPDATED_MANY_TASKS;
}

/**
 * Reducer function for an UpdatedManyTasks action.
 */
export function updatedManyTasks(state: MonkState, action: MonkUpdatedManyTasksAction): MonkState {
  const { tasks } = state;
  action.payload.forEach((task) => {
    const taskToUpdate = tasks.find((t) => t.id === task.id);
    if (taskToUpdate) {
      taskToUpdate.status = task.status;
    }
  });
  return {
    ...state,
    tasks: [...tasks],
  };
}
