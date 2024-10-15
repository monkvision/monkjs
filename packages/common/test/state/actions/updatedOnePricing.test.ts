import {
  createEmptyMonkState,
  MonkActionType,
  MonkUpdatedOnePricingAction,
  isUpdatedOnePricingAction,
  updatedOnePricing,
} from '../../../src';
import { Inspection, MonkEntityType, PricingV2RelatedItemType } from '@monkvision/types';

const action: MonkUpdatedOnePricingAction = {
  type: MonkActionType.UPDATED_ONE_PRICING,
  payload: {
    pricing: {
      entityType: MonkEntityType.PRICING,
      id: 'test-id',
      inspectionId: 'inspections-test',
      relatedItemType: PricingV2RelatedItemType.PART,
      pricing: 10,
    },
  },
};

describe('UpdatedOnePricing action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isUpdatedOnePricingAction({ type: MonkActionType.UPDATED_ONE_PRICING })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isUpdatedOnePricingAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(updatedOnePricing(state, action), state)).toBe(false);
    });

    it('should update pricing in the state', () => {
      const state = createEmptyMonkState();
      state.inspections.push({
        id: 'inspections-test',
        pricings: [action.payload.pricing.id],
      } as Inspection);
      state.pricings.push({ ...action.payload.pricing, pricing: 90 });
      const newState = updatedOnePricing(state, action);
      const inspectionPricing = newState.inspections.find(
        (ins) => ins.id === action.payload.pricing.inspectionId,
      )?.pricings;
      expect(inspectionPricing?.length).toBe(1);
      expect(inspectionPricing).toContainEqual(action.payload.pricing.id);
      expect(newState.pricings).toContainEqual({
        ...action.payload.pricing,
      });
    });
  });
});
