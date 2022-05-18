import { AxiosResponse } from 'axios';
import { NormalizedSchema } from 'normalizr';
import { NormalizedEntities } from './entities';

/**
 * An object containing an inspection id (uuid).
 */
export interface ReponseWithInspectionId {
  /**
   * The id (uuid) of the inspection.
   */
  inspectionId: string;
}

/**
 * An object containing an id (given a specific id attribute name).
 *
 * *IdAttribute* - The name of the id attribute (must be a string constant).
 */
export type IdResponse<IdAttribute extends string> = {
  /**
   * The id of the entity.
   */
  [key in IdAttribute]: string;
};

/**
 * The default response type for every CoreJs api call.
 *
 * *Data* - The type of the axios response body. Generally this type refers to the entity that has been fetched, a page
 * of this entity etc...
 *
 * *Result* - The result returned by the CoreJs API.
 */
export type CoreJsResponse<Data, Result> = NormalizedSchema<NormalizedEntities, Result> & {
  axiosResponse: AxiosResponse<Data>;
};

/**
 * The response type for every CoreJs api call that also returns a unique ID.
 *
 * *Data* - The type of the axios response body. Generally this type refers to the entity that has been fetched, a page
 * of this entity etc...
 *
 * *Result* - The result returned by the CoreJs API.
 *
 * *IdAttribute* - The name of the id attribute (must be a string constant).
 */
export type CoreJsResponseWithId<Data, Result, IdAttribute extends string> =
  CoreJsResponse<Data, Result> & IdResponse<IdAttribute>;
