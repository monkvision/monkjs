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
  /**
   * This ID is used when you first want to create the entity locally while you wait for the API to give you the true
   * ID of the damage. You first create the damage with a custom local ID, then you dispatch the action a second time
   * and specify this custom ID in the `localId` param. The damage will then be updated instead of added.
   */
  localId?: string;
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
    inspection.pricings = inspection.pricings?.filter(
      (pricingId) => ![payload.pricing.id, payload.localId].includes(pricingId),
    );
    inspection.pricings?.push(payload.pricing.id);
  }
  const newPricings = pricings.filter(
    (pricing) => ![payload.pricing.id, payload.localId].includes(pricing.id),
  );
  newPricings.push(action.payload.pricing);
  return {
    ...state,
    pricings: newPricings,
    inspections: [...inspections],
  };
}
