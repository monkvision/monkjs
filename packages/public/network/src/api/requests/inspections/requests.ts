import ky from 'ky';
import { getKyConfig, MonkAPIConfig } from '../../config';
import { MonkAPIRequest } from '../types';
import { ApiInspectionGet } from '../../apiModels';
import { mapGetInspectionResponse } from './mappers';

/**
 * Utility function that fetches an inspection data from the API.
 */
export const getInspection: MonkAPIRequest<[id: string], ApiInspectionGet> = async (
  id: string,
  config: MonkAPIConfig,
) => {
  const { baseUrl, headers } = getKyConfig(config);
  const response = await ky.get(`${baseUrl}/inspections/${id}`, {
    headers,
  });
  const body = await response.json<ApiInspectionGet>();
  return {
    payload: {
      entities: mapGetInspectionResponse(body),
    },
    response,
    body,
  };
};
