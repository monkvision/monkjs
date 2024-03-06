import ky from 'ky';
import { MonkActionType, MonkGotOneInspectionAction } from '@monkvision/common';
import { getDefaultOptions, MonkAPIConfig } from '../config';
import { ApiInspectionGet } from '../models';
import { mapApiInspectionGet } from './mappers';
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
  const options = getDefaultOptions(config);
  const response = await ky.get(`inspections/${id}`, options);
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
