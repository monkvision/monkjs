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
  /**
   * This ID is used when you first want to create the entity locally while you wait for the API to give you the true
   * ID of the damage. You first create the damage with a custom local ID, then you dispatch the action a second time
   * and specify this custom ID in the `localId` param. The damage will then be updated instead of added.
   */
  localId?: string;
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
    inspection.damages = inspection.damages.filter(
      (damageId) => ![payload.damage.id, payload.localId].includes(damageId),
    );
    inspection.damages.push(payload.damage.id);
  }
  const newDamages = damages.filter(
    (damage) => ![payload.damage.id, payload.localId].includes(damage.id),
  );
  const partsRelated = action.payload.damage.parts
    .map((part) => parts.find((value) => value.type === part)?.id)
    .filter((v) => v !== undefined) as string[];
  const newParts = parts.map((part) => {
    if (partsRelated.includes(part.id)) {
      const damageIds = part.damages.filter(
        (damageId) => ![payload.damage.id, payload.localId].includes(damageId),
      );
      return {
        ...part,
        damages: [...damageIds, payload.damage.id],
      };
    }
    return part;
  });
  newDamages.push({ ...payload.damage, parts: partsRelated });
  return {
    ...state,
    parts: newParts,
    damages: newDamages,
    inspections: [...inspections],
  };
}
