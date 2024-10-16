import {
  createEmptyMonkState,
  MonkActionType,
  MonkDeletedOnePricingAction,
  isDeletedOnePricingAction,
  deletedOnePricing,
} from '../../../src';
import { Inspection, PricingV2 } from '@monkvision/types';

const action: MonkDeletedOnePricingAction = {
  type: MonkActionType.DELETED_ONE_PRICING,
  payload: {
    inspectionId: 'inspections-test',
    pricingId: 'pricing-id-test',
  },
};

describe('DeletedOnePricing action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isDeletedOnePricingAction({ type: MonkActionType.DELETED_ONE_PRICING })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isDeletedOnePricingAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(deletedOnePricing(state, action), state)).toBe(false);
    });

    it('should delete pricing in the state', () => {
      const state = createEmptyMonkState();
      state.inspections.push({
        id: 'inspections-test',
        pricings: [action.payload.pricingId],
      } as Inspection);
      state.pricings.push({ id: action.payload.pricingId } as PricingV2);
      const newState = deletedOnePricing(state, action);
      const inspectionPricing = newState.inspections.find(
        (ins) => ins.id === action.payload.inspectionId,
      )?.pricings;
      expect(inspectionPricing?.length).toBe(0);
      expect(inspectionPricing).not.toContainEqual(action.payload.pricingId);
      expect(
        newState.pricings.find((pricing) => pricing.id === action.payload.pricingId),
      ).toBeUndefined();
    });
  });
});
