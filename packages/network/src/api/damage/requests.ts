import {
  MonkActionType,
  MonkCreatedOneDamageAction,
  MonkDeletedOneDamageAction,
} from '@monkvision/common';
import { DamageType, MonkEntityType, VehiclePart } from '@monkvision/types';
import ky from 'ky';
import { v4 } from 'uuid';
import { Dispatch } from 'react';
import { getDefaultOptions, MonkApiConfig } from '../config';
import { ApiIdColumn } from '../models';
import { MonkApiResponse } from '../types';
import { mapApiDamagePostRequest } from './mappers';

/**
 * Options passed to the `createDamage` API request.
 */
export interface CreateDamageOptions {
  /**
   * The ID of the inspection to update via the API.
   */
  id: string;
  /**
   * Damage type used for the update operation.
   */
  damageType: DamageType;
  /**
   * Vehicle part used for the update operation.
   */
  vehiclePart: VehiclePart;
}

/**
 * Create a new damage with the given options. See the `CreateDamageOptions` interface for more details.
 *
 * @param options The options of the inspection.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see CreateDamageOptions
 */

export async function createDamage(
  options: CreateDamageOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkCreatedOneDamageAction>,
): Promise<MonkApiResponse> {
  const localId = v4();
  dispatch?.({
    type: MonkActionType.CREATED_ONE_DAMAGE,
    payload: {
      damage: {
        entityType: MonkEntityType.DAMAGE,
        id: localId,
        inspectionId: options.id,
        parts: [options.vehiclePart],
        relatedImages: [],
        type: options.damageType,
      },
    },
  });
  const kyOptions = getDefaultOptions(config);
  const response = await ky.post(`inspections/${options.id}/damages`, {
    ...kyOptions,
    json: mapApiDamagePostRequest(options.damageType, options.vehiclePart),
  });
  const body = await response.json<ApiIdColumn>();
  dispatch?.({
    type: MonkActionType.CREATED_ONE_DAMAGE,
    payload: {
      damage: {
        entityType: MonkEntityType.DAMAGE,
        id: body.id,
        inspectionId: options.id,
        parts: [options.vehiclePart],
        relatedImages: [],
        type: options.damageType,
      },
      localId,
    },
  });
  return {
    id: body.id,
    response,
    body,
  };
}

/**
 * Options passed to the `deleteDamage` API request.
 */
export interface DeleteDamageOptions {
  /**
   * The ID of the inspection to update via the API.
   */
  id: string;
  /**
   * Damage ID that will be deleted.
   */
  damageId: string;
}

/**
 * Delete a damage with the given options. See the `DeleteDamageOptions` interface for more details.
 *
 * @param options The options of the inspection.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see DeleteDamageOptions
 */

export async function deleteDamage(
  options: DeleteDamageOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkDeletedOneDamageAction>,
): Promise<MonkApiResponse> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.delete(`inspections/${options.id}/damages/${options.damageId}`, {
    ...kyOptions,
  });
  const body = await response.json<ApiIdColumn>();
  dispatch?.({
    type: MonkActionType.DELETED_ONE_DAMAGE,
    payload: { inspectionId: options.id, damageId: body.id },
  });
  return {
    id: body.id,
    response,
    body,
  };
}
