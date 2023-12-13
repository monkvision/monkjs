import axios from 'axios';
import { getBaseAxiosConfig, MonkAPIConfig } from '../../config';
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
  const axiosResponse = await axios.request<ApiInspectionGet>({
    ...getBaseAxiosConfig(config),
    method: 'get',
    url: `/inspections/${id}`,
  });
  return {
    payload: {
      entities: mapGetInspectionResponse(axiosResponse.data),
    },
    axiosResponse,
  };
};
