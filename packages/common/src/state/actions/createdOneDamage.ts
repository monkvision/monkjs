import { Damage } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkCreatedOneDamagePayload.
 */
export interface MonkCreatedOneDamagePayload {
  /**
   * The damage created.
   */
  damage: Damage;
}

/**
 * Action dispatched when a damage have been created.
 */
export interface MonkCreatedOneDamageAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.CREATED_ONE_DAMAGE`.
   */
  type: MonkActionType.CREATED_ONE_DAMAGE;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkCreatedOneDamagePayload;
}

/**
 * Matcher function that matches a CreatedOneDamage while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isCreatedOneDamageAction(action: MonkAction): action is MonkCreatedOneDamageAction {
  return action.type === MonkActionType.CREATED_ONE_DAMAGE;
}

/**
 * Reducer function for a createdOneDamage action.
 */
export function createdOneDamage(state: MonkState, action: MonkCreatedOneDamageAction): MonkState {
  const { damages, inspections, parts } = state;
  const { payload } = action;

  const inspection = inspections.find((value) => value.id === payload.damage.inspectionId);
  if (inspection) {
    inspection.damages.push(action.payload.damage.id);
  }
  const partsRelated = action.payload.damage.parts
    .map((part) => parts.find((value) => value.type === part)?.id)
    .filter((v) => v !== undefined) as string[];
  const newParts = parts.map((part) => {
    if (partsRelated.includes(part.id)) {
      return { ...part, damages: [...part.damages, payload.damage.id] };
    }
    return part;
  });
  damages.push({ ...payload.damage, parts: partsRelated });
  return {
    ...state,
    parts: newParts,
    damages: [...damages],
    inspections: [...inspections],
  };
}
