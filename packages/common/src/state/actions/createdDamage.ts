import { DamageType, Vehicle, VehiclePart } from '@monkvision/types';
import { MonkAction, MonkActionType } from './monkAction';
import { MonkState } from '../state';

/**
 * The payload of a MonkUpdatedVehicleAction.
 */
export interface MonkCreatedDamagePayload {
  /**
   * The ID of the inspection to which the vehicle was updated.
   */
  inspectionId: string;
  /**
   * The updated vehicle.
   */
  damageType: DamageType;
  partType: VehiclePart;
}

/**
 * Action dispatched when a vehicle have been updated.
 */
export interface MonkCreatedDamageAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.UPDATED_VEHICLE`.
   */
  type: MonkActionType.CREATED_DAMAGE;
  /**
   * The payload of the action containing the fetched entities.
   */
  payload: MonkCreatedDamagePayload;
}

/**
 * Matcher function that matches a UpdatedVehicle while also inferring its type using TypeScript's type predicate
 * feature.
 */
export function isUpdatedVehicleAction(action: MonkAction): action is MonkCreatedDamageAction {
  return action.type === MonkActionType.UPDATED_VEHICLE;
}

/**
 * Reducer function for a UpdatedVehicle action.
 */
export function createdDamage(state: MonkState, action: MonkCreatedDamageAction): MonkState {
  const { vehicles, inspections } = state;

  const inspection = inspections.find((value) => value.id === action.payload.inspectionId);
  const isVehiculeIdMatching = inspection?.vehicle === action.payload.vehicle.id;

  if (inspection && !isVehiculeIdMatching) {
    inspection.vehicle = action.payload.vehicle.id;
  }

  const index = vehicles.findIndex((vehicle) => vehicle.id === action.payload.vehicle.id);
  if (index >= 0) {
    vehicles[index] = action.payload.vehicle;
  }

  return {
    ...state,
    vehicles: [...vehicles],
  };
}
