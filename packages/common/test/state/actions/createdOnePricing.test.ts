import {
  createEmptyMonkState,
  MonkActionType,
  createdOnePricing,
  MonkCreatedOnePricingAction,
  isCreatedOnePricingAction,
} from '../../../src';
import { Inspection, MonkEntityType, PricingV2RelatedItemType } from '@monkvision/types';

const action: MonkCreatedOnePricingAction = {
  type: MonkActionType.CREATED_ONE_PRICING,
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

describe('CreatedOnePricing action handlers', () => {
  describe('Action matcher', () => {
    it('should return true if the action has the proper type', () => {
      expect(isCreatedOnePricingAction({ type: MonkActionType.CREATED_ONE_PRICING })).toBe(true);
    });

    it('should return false if the action does not have the proper type', () => {
      expect(isCreatedOnePricingAction({ type: MonkActionType.RESET_STATE })).toBe(false);
    });
  });

  describe('Action handler', () => {
    it('should return a new state', () => {
      const state = createEmptyMonkState();
      expect(Object.is(createdOnePricing(state, action), state)).toBe(false);
    });

    it('should create pricing in the state', () => {
      const state = createEmptyMonkState();
      state.inspections.push({
        id: 'inspections-test',
        pricings: [] as string[],
      } as Inspection);
      const newState = createdOnePricing(state, action);
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
