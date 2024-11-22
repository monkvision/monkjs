import { KyResponse } from 'ky';
import { ApiIdColumn } from './models';

/**
 * Default return type of Monk API Request, containing just the ID of the affected entity.
 */
export interface MonkId {
  /**
   * The ID of the entity that was affected by the API request.
   */
  id: string;
}

/**
 * Generic type definition for the response returned by a Monk API Request.
 */
export type MonkApiResponse<T extends object = MonkId, K extends object = ApiIdColumn> = T & {
  /**
   * The raw HTTP response object.
   */
  response: KyResponse;
  /**
   * The body of the response.
   */
  body: K;
};

export interface PaginationResponse {
  before?: string;
  after?: string;
}
