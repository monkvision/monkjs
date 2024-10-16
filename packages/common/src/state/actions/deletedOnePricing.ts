import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkDeletedOnePricingPayload.
 */
export interface MonkDeletedtedOnePricingPayload {
  /**
   * The ID of the inspection to which the pricing was deleted.
   */
  inspectionId: string;
  /**
   * The pricing ID deleted.
   */
  pricingId: string;
}

/**
 * Action dispatched when a pricing have been deleted.
 */
export interface MonkDeletedOnePricingAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.DELETED_ONE_PRICING`.
   */
  type: MonkActionType.DELETED_ONE_PRICING;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkDeletedtedOnePricingPayload;
}

/**
 * Matcher function that matches a DeletedOnePricing while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isDeletedOnePricingAction(
  action: MonkAction,
): action is MonkDeletedOnePricingAction {
  return action.type === MonkActionType.DELETED_ONE_PRICING;
}

/**
 * Reducer function for a deletedOnePricing action.
 */
export function deletedOnePricing(
  state: MonkState,
  action: MonkDeletedOnePricingAction,
): MonkState {
  const { pricings, inspections } = state;
  const { payload } = action;

  const inspection = inspections.find((value) => value.id === payload.inspectionId);
  if (inspection) {
    inspection.pricings = inspection.pricings?.filter(
      (pricingId) => pricingId !== payload.pricingId,
    );
  }
  const newPricings = pricings.filter((pricing) => pricing.id !== payload.pricingId);
  return {
    ...state,
    pricings: newPricings,
    inspections: [...inspections],
  };
}
