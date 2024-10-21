import {
  createEmptyMonkState,
  MonkActionType,
  isDeletedOneDamageAction,
  deletedOneDamage,
  MonkDeletedOneDamageAction,
} from '../../../src';
import { Damage, Inspection, Part } from '@monkvision/types';

const action: MonkDeletedOneDamageAction = {
  type: MonkActionType.DELETED_ONE_DAMAGE,
  payload: {
    inspectionId: 'inspections-test',
    damageId: 'pricing-id-test',
  },
};

describe('DeletedOneDamage action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isDeletedOneDamageAction({ type: MonkActionType.DELETED_ONE_DAMAGE })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isDeletedOneDamageAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(deletedOneDamage(state, action), state)).toBe(false);
    });

    it('should delete damage in the state', () => {
      const state = createEmptyMonkState();
      const partId = 'part-id-test';
      state.inspections.push({
        id: 'inspections-test',
        damages: [action.payload.damageId] as string[],
      } as Inspection);
      state.damages.push({
        id: action.payload.damageId,
        parts: [partId],
      } as Damage);
      state.parts.push({
        id: partId,
        damages: [action.payload.damageId],
      } as Part);
      const newState = deletedOneDamage(state, action);
      const inspectionDamage = newState.inspections.find(
        (ins) => ins.id === action.payload.inspectionId,
      )?.damages;

      expect(inspectionDamage?.length).toBe(0);
      expect(inspectionDamage).not.toContainEqual(action.payload.damageId);
      expect(newState.damages.length).toBe(0);
      expect(newState.parts.find((part) => part.id === partId)?.damages.length).toBe(0);
      expect(
        newState.damages.find((damage) => damage.id === action.payload.damageId),
      ).toBeUndefined();
    });
  });
});
