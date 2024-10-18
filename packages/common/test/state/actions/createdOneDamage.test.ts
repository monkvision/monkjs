import {
  createEmptyMonkState,
  MonkActionType,
  createdOneDamage,
  isCreatedOneDamageAction,
  MonkCreatedOneDamageAction,
} from '../../../src';
import { Inspection, MonkEntityType, VehiclePart, DamageType, Part } from '@monkvision/types';

const action: MonkCreatedOneDamageAction = {
  type: MonkActionType.CREATED_ONE_DAMAGE,
  payload: {
    damage: {
      entityType: MonkEntityType.DAMAGE,
      id: 'test-id',
      inspectionId: 'inspections-test',
      parts: [VehiclePart.ROOF],
      relatedImages: [],
      type: DamageType.SCRATCH,
    },
  },
};

describe('CreatedOneDamage action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isCreatedOneDamageAction({ type: MonkActionType.CREATED_ONE_DAMAGE })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isCreatedOneDamageAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(createdOneDamage(state, action), state)).toBe(false);
    });

    it('should create damage in the state', () => {
      const state = createEmptyMonkState();
      const part = {
        id: 'part-id',
        type: VehiclePart.ROOF,
      };
      state.inspections.push({
        id: 'inspections-test',
        damages: [] as string[],
      } as Inspection);
      state.parts.push(part as Part);
      const newState = createdOneDamage(state, action);
      const inspectionDamage = newState.inspections.find(
        (ins) => ins.id === action.payload.damage.inspectionId,
      )?.damages;

      expect(inspectionDamage?.length).toBe(1);
      expect(inspectionDamage).toContainEqual(action.payload.damage.id);
      expect(newState.damages).toContainEqual({
        ...action.payload.damage,
        parts: [part.id],
      });
    });
  });
});
