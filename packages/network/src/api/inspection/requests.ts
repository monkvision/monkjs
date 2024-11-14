import ky from 'ky';
import {
  MonkAction,
  MonkActionType,
  MonkGotOneInspectionAction,
  MonkState,
  MonkUpdatedOneInspectionAdditionalDataAction,
} from '@monkvision/common';
import { AdditionalData, ComplianceOptions, CreateInspectionOptions } from '@monkvision/types';
import { Dispatch } from 'react';
import { getDefaultOptions, MonkApiConfig } from '../config';
import { ApiIdColumn, ApiInspectionGet, ApiInspectionsGet } from '../models';
import {
  GetInspectionsOptions,
  mapApiInspectionGet,
  mapApiInspectionPost,
  mapApiInspectionsGet,
  mapApiInspectionsUrlParamsGet,
} from './mappers';
import { MonkApiResponse } from '../types';

/**
 * Options passed to the `getInspection` API request.
 */
export interface GetInspectionOptions {
  /**
   * The ID of the inspection to fetch from the API.
   */
  id: string;
  /**
   * Additional options used to configure the compliance locally.
   */
  compliance?: ComplianceOptions;
}

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
 * @param options The options of the request.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 */
export async function getInspection(
  options: GetInspectionOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkGotOneInspectionAction>,
): Promise<MonkApiResponse<GetInspectionResponse, ApiInspectionGet>> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.get(`inspections/${options.id}`, kyOptions);
  const body = await response.json<ApiInspectionGet>();
  const entities = mapApiInspectionGet(body, config.thumbnailDomain, options.compliance);
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
  config: MonkApiConfig,
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

/**
 * Options passed to the `updateAdditionalData` API request.
 */
export interface UpdateAdditionalDataOptions {
  /**
   * The ID of the inspection to update via the API.
   */
  id: string;
  /**
   * Callback function that takes optional additional data and returns the updated additional data.
   */
  callback: (additionalData?: AdditionalData) => AdditionalData;
}

/**
 * Update the additional data of inspection with the given options.
 * See the `UpdateAdditionalDataOptions` interface for more details.
 *
 * @param options The options of the request.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 * @see UpdateAdditionalDataOptions
 */
export async function updateAdditionalData(
  options: UpdateAdditionalDataOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkUpdatedOneInspectionAdditionalDataAction>,
): Promise<MonkApiResponse> {
  const { entities } = await getInspection({ id: options.id }, config);
  const inspection = entities.inspections.find((i) => i.id === options.id);
  if (!inspection) {
    throw new Error('Inspection does not exist');
  }
  const newAdditionalData = options.callback(inspection.additionalData);

  const kyOptions = getDefaultOptions(config);
  const response = await ky.patch(`inspections/${options.id}`, {
    ...kyOptions,
    json: { additional_data: newAdditionalData },
  });
  const body = await response.json<ApiIdColumn>();
  dispatch?.({
    type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
    payload: {
      inspectionId: options.id,
      additionalData: newAdditionalData,
    },
  });
  return {
    id: body.id,
    response,
    body,
  };
}

/**
 * Fetch the details of multiple inspections.
 *
 * @param options The options of the request.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 */
export async function getInspections(
  options: GetInspectionsOptions,
  config: MonkApiConfig,
  dispatch?: Dispatch<MonkGotOneInspectionAction>,
): Promise<MonkApiResponse<GetInspectionResponse, ApiInspectionsGet>> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.get(`inspections${mapApiInspectionsUrlParamsGet(options)}`, kyOptions);
  const body = await response.json<ApiInspectionsGet>();
  const entities = mapApiInspectionsGet(body, config.thumbnailDomain);
  dispatch?.({
    type: MonkActionType.GOT_ONE_INSPECTION,
    payload: entities,
  });
  return { entities, response, body };
}
