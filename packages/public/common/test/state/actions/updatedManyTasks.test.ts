import {
  createEmptyMonkState,
  isUpdatedManyTasksAction,
  MonkActionType,
  MonkUpdatedManyTasksAction,
  updatedManyTasks,
} from '../../../src';
import { ProgressStatus, Task, TaskName } from '@monkvision/types';

const action: MonkUpdatedManyTasksAction = {
  type: MonkActionType.UPDATED_MANY_TASKS,
  payload: [
    { id: 'test-1', status: ProgressStatus.TODO },
    { id: 'test-2', status: ProgressStatus.IN_PROGRESS },
  ],
};

describe('UpdatedManyTasks action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isUpdatedManyTasksAction({ type: MonkActionType.UPDATED_MANY_TASKS })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isUpdatedManyTasksAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(updatedManyTasks(state, action), state)).toBe(false);
    });

    it('should update tasks in the state', () => {
      const state = createEmptyMonkState();
      const task1 = {
        id: action.payload[0].id,
        name: TaskName.DAMAGE_DETECTION,
        status: ProgressStatus.ERROR,
      } as Task;
      const task2 = {
        id: action.payload[1].id,
        name: TaskName.DASHBOARD_OCR,
        status: ProgressStatus.ERROR,
      } as Task;
      state.tasks.push({ ...task1 }, { ...task2 });
      const newState = updatedManyTasks(state, action);
      expect(newState.tasks.length).toBe(2);
      expect(newState.tasks).toContainEqual({
        ...task1,
        status: action.payload[0].status,
      });
      expect(newState.tasks).toContainEqual({
        ...task2,
        status: action.payload[1].status,
      });
    });

    it('should not o anything if the tasks do not exist', () => {
      const state = createEmptyMonkState();
      const newState = updatedManyTasks(state, action);
      expect(newState.tasks.length).toBe(0);
    });
  });
});
