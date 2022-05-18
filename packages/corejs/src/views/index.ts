import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { isEmpty, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

import { normalize } from 'normalizr';
import config from '../config';

import createEntityReducer from '../createEntityReducer';
import { ImagePayloadTypes } from '../images/reduxTypes';
import { InspectionPayloadTypes } from '../inspections/reduxTypes';
import { IdResponse, RootState } from '../sharedTypes';
import { CreatedView, CreateOneViewResponse, CreateView, DeleteOneViewResponse } from './apiTypes';
import { NormalizedView } from './entityTypes';
import { ViewPayloadTypes } from './reduxTypes';

import schema, { idAttribute, key } from './schema';

/**
 * Create a new view of a damage on an inspection.
 *
 * @param {string} inspectionId The inspection id.
 * @param {CreateView} createView The details of the view to create.
 */
export async function createOne(inspectionId: string, createView: CreateView): Promise<CreateOneViewResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections/${inspectionId}/views`,
    data: mapKeysDeep(createView, (v, k) => snakeCase(k)),
  });

  const id = axiosResponse.data[idAttribute];
  const entity: CreatedView = {
    [idAttribute]: id,
    createdAt: new Date().toISOString(),
    imageRegion: {
      imageId: createView.imageId,
      specification: {
        polygons: createView.polygons,
        boundingBox: createView.boundingBox,
      },
    },
  };

  return {
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
  };
}

/**
 * Delete a view from an inspection.
 *
 * @param {string} id The id of the view to delete.
 * @param {string} inspectionId The id of the inspection.
 */
export async function deleteOne(id: string, inspectionId: string): Promise<DeleteOneViewResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'delete',
    url: `/inspections/${inspectionId}/views/${id}`,
  });

  const result = {
    [idAttribute]: id,
  };

  return {
    axiosResponse,
    inspectionId,
    [idAttribute]: id,
    ...normalize(result, schema),
  };
}

export const entityAdapter = createEntityAdapter<NormalizedView>({});
export const entityReducer = createEntityReducer<NormalizedView, ViewPayloadTypes>(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder.addCase('images/gotOne', (
      state: EntityState<NormalizedView>,
      action: PayloadAction<ImagePayloadTypes['GotOne'], 'images/gotOne'>,
    ) => {
      const { entities } = action.payload;
      const views = entities[key];
      if (!isEmpty(views)) { entityAdapter.upsertMany(state, views); }
    }).addCase('images/gotMany', (
      state: EntityState<NormalizedView>,
      action: PayloadAction<ImagePayloadTypes['GotMany'], 'images/gotMany'>,
    ) => {
      const { entities } = action.payload;
      const views = entities[key];
      if (!isEmpty(views)) { entityAdapter.upsertMany(state, views); }
    }).addCase('inspections/gotOne', (
      state: EntityState<NormalizedView>,
      action: PayloadAction<InspectionPayloadTypes['GotOne'], 'inspections/gotOne'>,
    ) => {
      const { entities } = action.payload;
      const views = entities[key];
      if (!isEmpty(views)) { entityAdapter.upsertMany(state, views); }
    }).addCase('inspections/gotMany', (
      state: EntityState<NormalizedView>,
      action: PayloadAction<InspectionPayloadTypes['GotMany'], 'inspections/gotMany'>,
    ) => {
      const { entities } = action.payload;
      const views = entities[key];
      if (!isEmpty(views)) { entityAdapter.upsertMany(state, views); }
    });
  },
});
