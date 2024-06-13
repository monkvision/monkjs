import {
  createEmptyMonkState,
  MonkActionType,
  MonkUpdatedVehicleAction,
  updatedVehicle,
  isUpdatedVehicleAction,
} from '../../../src';
import { Inspection, MonkEntityType, Vehicle, VehicleType } from '@monkvision/types';

const action: MonkUpdatedVehicleAction = {
  type: MonkActionType.UPDATED_VEHICLE,
  payload: {
    inspectionId: 'inspections-test-111111',
    vehicle: {
      id: 'vehicles-test-111111',
      entityType: MonkEntityType.VEHICLE,
      type: VehicleType.PICKUP,
    },
  },
};

describe('UpdatedVehicle action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isUpdatedVehicleAction({ type: MonkActionType.UPDATED_VEHICLE })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isUpdatedVehicleAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(updatedVehicle(state, action), state)).toBe(false);
    });

    it('should update vehicle in the state', () => {
      const state = createEmptyMonkState();
      state.inspections.push({
        id: 'inspections-test-111111',
        vehicle: 'vehicles-test-111111',
      } as Inspection);
      state.vehicles.push({ id: 'vehicles-test-111111' } as Vehicle);
      const newState = updatedVehicle(state, action);
      expect(newState.vehicles.length).toBe(1);
      expect(newState.vehicles).toContainEqual({
        ...action.payload.vehicle,
      });
    });
  });
});
