import { PricingV2 } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkUpdatedOnePricingPayload.
 */
export interface MonkUpdatedOnePricingPayload {
  /**
   * The pricing created.
   */
  pricing: PricingV2;
}

/**
 * Action dispatched when a pricing have been updated.
 */
export interface MonkUpdatedOnePricingAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.UPDATED_ONE_PRICING`.
   */
  type: MonkActionType.UPDATED_ONE_PRICING;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkUpdatedOnePricingPayload;
}

/**
 * Matcher function that matches a updatedOnePricing while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isUpdatedOnePricingAction(
  action: MonkAction,
): action is MonkUpdatedOnePricingAction {
  return action.type === MonkActionType.UPDATED_ONE_PRICING;
}

/**
 * Reducer function for a updatedOnePricing action.
 */
export function updatedOnePricing(
  state: MonkState,
  action: MonkUpdatedOnePricingAction,
): MonkState {
  const { pricings } = state;
  const { payload } = action;

  const updatedPricings = pricings.map((pricing) =>
    pricing.id === payload.pricing.id ? { ...pricing, ...payload.pricing } : pricing,
  );
  return {
    ...state,
    pricings: updatedPricings,
  };
}
