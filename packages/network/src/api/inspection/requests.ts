import ky from 'ky';
import {
  MonkAction,
  MonkActionType,
  MonkGotOneInspectionAction,
  MonkState,
} from '@monkvision/common';
import { Dispatch } from 'react';
import { getDefaultOptions, MonkAPIConfig } from '../config';
import { ApiIdColumn, ApiInspectionGet } from '../models';
import { CreateInspectionOptions, mapApiInspectionGet, mapApiInspectionPost } from './mappers';
import { MonkApiResponse } from '../types';

/**
 * Type definition for the result of the `getInspection` API request.
 */
export interface GetInspectionResponse {
  /**
   * The normalized entities related to the inspection that have been fetched from the API.
   */
  entities: MonkState;
}

/**
 * Fetch the details of an inspection using its ID.
 *
 * @param id The ID of the inspection.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 */
export async function getInspection(
  id: string,
  config: MonkAPIConfig,
  dispatch?: Dispatch<MonkGotOneInspectionAction>,
): Promise<MonkApiResponse<GetInspectionResponse, ApiInspectionGet>> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.get(`inspections/${id}`, kyOptions);
  const body = await response.json<ApiInspectionGet>();
  const entities = mapApiInspectionGet(body);
  dispatch?.({
    type: MonkActionType.GOT_ONE_INSPECTION,
    payload: entities,
  });
  return { entities, response, body };
}

/**
 * Create a new inspection with the given options. See the `CreateInspectionOptions` interface for more details.
 *
 * @param options The options of the inspection.
 * @param config The API config.
 * @param [_dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see CreateInspectionOptions
 */
export async function createInspection(
  options: CreateInspectionOptions,
  config: MonkAPIConfig,
  _dispatch?: Dispatch<MonkAction>,
): Promise<MonkApiResponse> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.post('inspections', {
    ...kyOptions,
    json: mapApiInspectionPost(options),
  });
  const body = await response.json<ApiIdColumn>();
  return {
    id: body.id,
    response,
    body,
  };
}
