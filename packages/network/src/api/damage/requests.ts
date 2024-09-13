import ky from 'ky';
import { MonkAction } from '@monkvision/common';
import { DamageType, VehiclePart } from '@monkvision/types';
import { Dispatch } from 'react';
import { getDefaultOptions, MonkApiConfig } from '../config';
import { ApiIdColumn } from '../models';
import { mapApiDamagePost } from './mappers';

/**
 * Options used to specify how to update the vehicle of an inspection.
 */
export interface CreateDamageOptions {
  /**
   * The ID of the inspection.
   */
  inspectionId: string;
  /**
   * The vehicle details to update.
   */
  damageType: DamageType;
  partType: VehiclePart;
}
/**
 * Create a damage for an inspection.
 *
 * @param options The options of the request.
 * @param config The API config.
 * @param [_dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 */

export async function createDamage(
  options: CreateDamageOptions,
  config: MonkApiConfig,
  _dispatch?: Dispatch<MonkAction>,
) {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.patch(`inspections/${options.inspectionId}/damages`, {
    ...kyOptions,
    json: mapApiDamagePost(options.damageType, options.partType),
  });
  const body = await response.json<ApiIdColumn>();
  return {
    id: body.id,
    response,
    body,
  };
}
