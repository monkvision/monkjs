import ky from 'ky';
import { MonkAction } from '@monkvision/common';
import { Vehicle } from '@monkvision/types';
import { Dispatch } from 'react';
import { getDefaultOptions, MonkApiConfig } from '../config';
import { ApiIdColumn } from '../models';
import { mapApiVehiclePatch } from './mappers';

/**
 * Options used to specify how to update the vehicle of an inspection.
 */
export interface UpdateInspectionVehicleOptions {
  /**
   * The ID of the inspection.
   */
  inspectionId: string;
  /**
   * The vehicle details to update.
   */
  vehicle: Partial<Vehicle>;
}
/**
 * Update the vehicle of an inspection.
 *
 * @param options The options of the request.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 */

export async function updateInspectionVehicule(
  options: UpdateInspectionVehicleOptions,
  config: MonkApiConfig,
  _dispatch?: Dispatch<MonkAction>,
) {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.patch(`inspections/${options.inspectionId}/vehicle`, {
    ...kyOptions,
    json: mapApiVehiclePatch(options.vehicle),
  });
  const body = await response.json<ApiIdColumn>();
  return {
    id: body.id,
    response,
    body,
  };
}
