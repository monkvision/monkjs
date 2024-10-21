import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkDeletedOneDamagePayload.
 */
export interface MonkDeletedOneDamagePayload {
  /**
   * The ID of the inspection to which the damage was deleted.
   */
  inspectionId: string;
  /**
   * The damage ID deleted.
   */
  damageId: string;
}

/**
 * Action dispatched when a damage have been deleted.
 */
export interface MonkDeletedOneDamageAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.DELETED_ONE_DAMAGE`.
   */
  type: MonkActionType.DELETED_ONE_DAMAGE;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkDeletedOneDamagePayload;
}

/**
 * Matcher function that matches a DeletedOneDamage while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isDeletedOneDamageAction(action: MonkAction): action is MonkDeletedOneDamageAction {
  return action.type === MonkActionType.DELETED_ONE_DAMAGE;
}

/**
 * Reducer function for a deletedOneDamage action.
 */
export function deletedOneDamage(state: MonkState, action: MonkDeletedOneDamageAction): MonkState {
  const { damages, parts, inspections } = state;
  const { payload } = action;

  const inspection = inspections.find((value) => value.id === payload.inspectionId);
  if (inspection) {
    inspection.damages = inspection.damages?.filter((damageId) => damageId !== payload.damageId);
  }
  const newDamages = damages.filter((damage) => damage.id !== payload.damageId);
  const newParts = parts.map((part) => {
    if (part.damages.includes(payload.damageId)) {
      return { ...part, damages: part.damages.filter((damageId) => damageId !== payload.damageId) };
    }
    return part;
  });
  return {
    ...state,
    parts: newParts,
    damages: [...newDamages],
    inspections: [...inspections],
  };
}
