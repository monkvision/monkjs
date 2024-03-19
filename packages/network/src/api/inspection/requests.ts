import ky from 'ky';
import { MonkActionType, MonkGotOneInspectionAction } from '@monkvision/common';
import { getDefaultOptions, MonkAPIConfig } from '../config';
import { ApiIdColumn, ApiInspectionGet } from '../models';
import { CreateInspectionOptions, mapApiInspectionPost, mapApiInspectionGet } from './mappers';
import { MonkAPIRequest } from '../types';

/**
 * Fetch the details of an inspection using its ID. The resulting action of this request will contain the list of
 * every entity that has been fetched using this API call.
 *
 * @param id The ID of the inspection.
 * @param config The API config.
 */
export const getInspection: MonkAPIRequest<
  [id: string],
  MonkGotOneInspectionAction,
  ApiInspectionGet
> = async (id: string, config: MonkAPIConfig) => {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.get(`inspections/${id}`, kyOptions);
  const body = await response.json<ApiInspectionGet>();
  return {
    action: {
      type: MonkActionType.GOT_ONE_INSPECTION,
      payload: mapApiInspectionGet(body),
    },
    response,
    body,
  };
};

/**
 * Create a new inspection with the given options. See the `CreateInspectionOptions` interface for more details.
 *
 * @param options The options of the inspection.
 * @param config The API config.
 * @see CreateInspectionOptions
 */
export const createInspection: MonkAPIRequest<
  [options: CreateInspectionOptions],
  null,
  ApiIdColumn,
  { id: string }
> = async (options: CreateInspectionOptions, config: MonkAPIConfig) => {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.post('inspections', {
    ...kyOptions,
    json: mapApiInspectionPost(options),
  });
  const body = await response.json<ApiIdColumn>();
  return {
    action: null,
    id: body.id,
    response,
    body,
  };
};
