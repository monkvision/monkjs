import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { camelCase, isEmpty, isNil, omitBy, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

import { normalize } from 'normalizr';
import config from '../config';

import createEntityReducer from '../createEntityReducer';
import { InspectionPayloadTypes } from '../inspections/reduxTypes';
import { IdResponse, PaginatedResponse, RootState } from '../sharedTypes';
import {
  AddOneImageResponse,
  CreatedImage,
  CreateImage,
  GetManyImagesOptions,
  GetManyImagesResponse,
  ImageDetails,
} from './apiTypes';
import { NormalizedImage } from './entityTypes';
import { ImagePayloadTypes } from './reduxTypes';

import schema, { idAttribute, key } from './schema';

/**
 * Get a page of images of an inspection.
 *
 * @param {string} inspectionId The id of the inspection.
 * @param {GetManyImagesOptions} [options] The query options.
 */
export async function getMany(inspectionId: string, options?: GetManyImagesOptions): Promise<GetManyImagesResponse> {
  const params = mapKeysDeep(options, (v, k) => snakeCase(k));
  const axiosResponse = await axios.request<PaginatedResponse<ImageDetails>>({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${inspectionId}/images`,
    params: omitBy(params, isNil),
  });

  return {
    axiosResponse,
    inspectionId,
    ...normalize(mapKeysDeep(axiosResponse.data.data, (v, k) => camelCase(k)), [schema]),
  };
}

/**
 * Add an image to an inspection.
 *
 * @param {string} inspectionId The id of the inspeciton.
 * @param {CreatedImage} createImage The details of the image to add.
 */
export async function addOne(inspectionId: string, createImage: CreateImage): Promise<AddOneImageResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections/${inspectionId}/images`,
    data: mapKeysDeep(createImage, (v, k) => snakeCase(k)),
  });

  const id = axiosResponse.data[idAttribute];
  const entity: CreatedImage = {
    [idAttribute]: id,
    name: createImage.name,
  };

  return {
    axiosResponse,
    inspectionId,
    [idAttribute]: id,
    ...normalize(entity, schema),
  };
}

export const entityAdapter = createEntityAdapter<NormalizedImage>({});
export const entityReducer = createEntityReducer<NormalizedImage, ImagePayloadTypes>(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder.addCase('inspections/gotOne', (
      state: EntityState<NormalizedImage>,
      action: PayloadAction<InspectionPayloadTypes['GotOne'], 'inspections/gotOne'>,
    ) => {
      const { entities } = action.payload;
      const images = entities[key];
      if (!isEmpty(images)) { entityAdapter.upsertMany(state, images); }
    }).addCase('inspections/gotMany', (
      state: EntityState<NormalizedImage>,
      action: PayloadAction<InspectionPayloadTypes['GotMany'], 'inspections/gotMany'>,
    ) => {
      const { entities } = action.payload;
      const images = entities[key];
      if (!isEmpty(images)) { entityAdapter.upsertMany(state, images); }
    });
  },
});
