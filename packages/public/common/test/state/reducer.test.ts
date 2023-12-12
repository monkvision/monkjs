import { Inspection, View } from '@monkvision/types';
import {
  createEmptyMonkState,
  MonkAction,
  MonkActionType,
  monkReducer,
  MonkResetStateAction,
  MonkUpdateStateAction,
} from '../../src';

describe('Monk state reducer', () => {
  describe('Unknown action', () => {
    it('should return the same state', () => {
      const state = createEmptyMonkState();
      state.views.push({ id: 'test' } as unknown as View);
      const action = { type: 'unknown' } as unknown as MonkAction;
      const result = monkReducer(state, action);

      expect(result).toEqual(state);
    });
  });

  describe('Reset state action', () => {
    it('should returns an empty new state for MonkResetStateActions', () => {
      const state = createEmptyMonkState();
      state.views.push({ id: 'test' } as unknown as View);
      const action: MonkResetStateAction = { type: MonkActionType.RESET_STATE };
      const result = monkReducer(state, action);

      expect(result).toEqual(createEmptyMonkState());
    });
  });

  describe('Update state action', () => {
    it('should properly add new entities', () => {
      const exisingInspection = { id: 'test' } as unknown as Inspection;
      const newInspections = [{ id: 'ok' }, { id: 'lol' }] as unknown as Inspection[];
      const newViews = [{ id: 'yes' }] as unknown as View[];
      const state = createEmptyMonkState();
      state.inspections.push(exisingInspection);
      const action: MonkUpdateStateAction = {
        type: MonkActionType.UPDATE_STATE,
        payload: {
          entities: { inspections: newInspections, views: newViews },
        },
      };
      const result = monkReducer(state, action);

      expect(result).toEqual({
        ...createEmptyMonkState(),
        inspections: [exisingInspection, ...newInspections],
        views: newViews,
      });
    });

    it('should properly udpate existing entities', () => {
      const id = 'okayyyy';
      const exisingInspection = { id, val: 'nope' } as unknown as Inspection;
      const updatedInspection = { id, val: 'hello' } as unknown as Inspection;
      const state = createEmptyMonkState();
      state.inspections.push(exisingInspection);
      const action: MonkUpdateStateAction = {
        type: MonkActionType.UPDATE_STATE,
        payload: {
          entities: { inspections: [updatedInspection] },
        },
      };
      const result = monkReducer(state, action);

      expect(result).toEqual({
        ...createEmptyMonkState(),
        inspections: [updatedInspection],
      });
    });

    it('should delete existing entities', () => {
      const id = 'okayyyy';
      const exisingInspection = { id } as unknown as Inspection;
      const state = createEmptyMonkState();
      state.inspections.push(exisingInspection);
      const action: MonkUpdateStateAction = {
        type: MonkActionType.UPDATE_STATE,
        payload: {
          deleted: [id],
        },
      };
      const result = monkReducer(state, action);

      expect(result).toEqual(createEmptyMonkState());
    });

    it('should not add deleted entities', () => {
      const id = 'okayyyy';
      const newInspection = { id } as unknown as Inspection;
      const action: MonkUpdateStateAction = {
        type: MonkActionType.UPDATE_STATE,
        payload: {
          entities: { inspections: [newInspection] },
          deleted: [id],
        },
      };
      const result = monkReducer(createEmptyMonkState(), action);

      expect(result).toEqual(createEmptyMonkState());
    });
  });
});
