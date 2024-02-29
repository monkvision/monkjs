import { KyResponse } from 'ky';
import { MonkAction } from '@monkvision/common';
import { ApiIdColumn } from './models';
import { MonkAPIConfig } from './config';

/**
 * Type definition for the response of a Monk Api request.
 */
export interface MonkApiResponse<T extends MonkAction, K extends object = ApiIdColumn> {
  /**
   * The MonkAction to be dispatched in the MonkState if you want to synchronize the local state with the distant state
   * after this API call has been made.
   */
  action: T;
  /**
   * The raw HTTP response object.
   */
  response: KyResponse;
  /**
   * The body of the response.
   */
  body: K;
}

/**
 * Generic type definition for a utility function that makes a request to the Monk API.
 */
export type MonkAPIRequest<
  A extends unknown[],
  T extends MonkAction,
  K extends object = ApiIdColumn,
> = (...args: [...A, MonkAPIConfig]) => Promise<MonkApiResponse<T, K>>;
