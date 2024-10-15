import {
  createEmptyMonkState,
  MonkActionType,
  MonkUpdatedOneInspectionAdditionalDataAction,
  isUpdatedOneInspectionAdditionalDataAction,
  updatedOneInspectionAdditionalData,
} from '../../../src';
import { Inspection } from '@monkvision/types';

const action: MonkUpdatedOneInspectionAdditionalDataAction = {
  type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
  payload: {
    inspectionId: 'inspections-test',
    additionalData: { 'add-data-test': 'additionalData-test' },
  },
};

describe('UpdatedOne action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(
        isUpdatedOneInspectionAdditionalDataAction({
          type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
        }),
      ).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isUpdatedOneInspectionAdditionalDataAction({ type: MonkActionType.RESET_STATE })).toBe(
        false,
      );
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(updatedOneInspectionAdditionalData(state, action), state)).toBe(false);
    });

    it('should update pricing in the state', () => {
      const state = createEmptyMonkState();
      state.inspections.push({
        id: 'inspections-test',
        additionalData: {},
      } as Inspection);
      const newState = updatedOneInspectionAdditionalData(state, action);
      const inspection = newState.inspections.find((ins) => ins.id === action.payload.inspectionId);
      expect(inspection?.additionalData).toEqual(action.payload.additionalData);
    });
  });
});
