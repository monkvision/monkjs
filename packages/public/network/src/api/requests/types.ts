import { AxiosResponse } from 'axios';
import { MonkUpdateStatePayload } from '@monkvision/common';
import { MonkAPIConfig } from '../config';

/**
 * The default response format that every utility function returns when communicating with the Monk API.
 */
export interface MonkAPIResponse<T> {
  /**
   * The payload containing the information needed to update the state.
   */
  payload: MonkUpdateStatePayload;
  /**
   * The raw response object obtained from Axios when making the request.
   */
  axiosResponse: AxiosResponse<T>;
}

/**
 * Generic type definition for a utility function that makes a request to the Monk API.
 */
export type MonkAPIRequest<T extends unknown[], K> = (
  ...args: [...T, MonkAPIConfig]
) => Promise<MonkAPIResponse<K>>;
