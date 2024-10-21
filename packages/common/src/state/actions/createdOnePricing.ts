import { PricingV2 } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkCreatedOnePricingPayload.
 */
export interface MonkCreatedOnePricingPayload {
  /**
   * The pricing created.
   */
  pricing: PricingV2;
}

/**
 * Action dispatched when a pricing have been updated.
 */
export interface MonkCreatedOnePricingAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.CREATED_ONE_PRICING`.
   */
  type: MonkActionType.CREATED_ONE_PRICING;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkCreatedOnePricingPayload;
}

/**
 * Matcher function that matches a CreatedOnePricing while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isCreatedOnePricingAction(
  action: MonkAction,
): action is MonkCreatedOnePricingAction {
  return action.type === MonkActionType.CREATED_ONE_PRICING;
}

/**
 * Reducer function for a createdOnePricing action.
 */
export function createdOnePricing(
  state: MonkState,
  action: MonkCreatedOnePricingAction,
): MonkState {
  const { pricings, inspections } = state;
  const { payload } = action;

  const inspection = inspections.find((value) => value.id === payload.pricing.inspectionId);
  if (inspection) {
    inspection.pricings?.push(action.payload.pricing.id);
  }
  pricings.push(action.payload.pricing);
  return {
    ...state,
    pricings: [...pricings],
    inspections: [...inspections],
  };
}
