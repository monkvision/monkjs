import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { camelCase, isEmpty, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

import { normalize } from 'normalizr';
import config from '../config';

import createEntityReducer, { GotManyEntitiesPayload } from '../createEntityReducer';
import { GetOneImageResponse } from '../images/apiTypes';
import { InspectionPayloadTypes } from '../inspections/reduxTypes';
import { RootState } from '../sharedTypes';
import { UpsertDamageArea, UpsertOneDamageAreaResponse } from './apiTypes';
import { DamageArea, NormalizedDamageArea } from './entityTypes';
import { DamageAreaPayloadTypes } from './reduxTypes';

import schema, { idAttribute, key } from './schema';

/**
 * Create or update a damage area entity.
 *
 * @param {string} inspectionId The ID of the inspection entity the damage area entity belong to.
 * @param {string} imageId The ID of the image entity  the damage area entity belong to.
 * @param {UpsertDamageArea} createDamageArea The details of the eneity to create.
 */
export async function upsertOne(
  inspectionId: string,
  imageId: string,
  createDamageArea: UpsertDamageArea,
): Promise<UpsertOneDamageAreaResponse> {
  const axiosResponse = await axios.request<DamageArea>({
    ...config.axiosConfig,
    method: 'patch',
    url: `inspections/${inspectionId}/images/${imageId}/damage_areas`,
    data: mapKeysDeep(createDamageArea, (v, k) => snakeCase(k)),
  });

  return {
    axiosResponse,
    [idAttribute]: axiosResponse.data[idAttribute],
    ...normalize(mapKeysDeep(axiosResponse.data, (v, k) => camelCase(k)), schema),
  };
}

export const entityAdapter = createEntityAdapter<NormalizedDamageArea>({});
export const entityReducer = createEntityReducer<NormalizedDamageArea, DamageAreaPayloadTypes>(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder.addCase('images/gotOne', (
      state: EntityState<NormalizedDamageArea>,
      action: PayloadAction<GetOneImageResponse, 'images/gotOne'>,
    ) => {
      const { entities, result } = action.payload;
      const damageArea = result.damageArea;
      if (damageArea) { entityAdapter.upsertOne(state, entities[key][damageArea]); }
    }).addCase('images/gotMany', (
      state: EntityState<NormalizedDamageArea>,
      action: PayloadAction<GotManyEntitiesPayload, 'images/gotMany'>,
    ) => {
      const { entities, result } = action.payload;
      const damageAreas = result.map((id) => entities[key][id]);
      if (!isEmpty(damageAreas)) { entityAdapter.upsertMany(state, damageAreas); }
    }).addCase('inspections/gotOne', (
      state: EntityState<NormalizedDamageArea>,
      action: PayloadAction<InspectionPayloadTypes['GotOne'], 'inspections/gotOne'>,
    ) => {
      const { entities } = action.payload;
      const damageAreas = entities[key];
      if (!isEmpty(damageAreas)) { entityAdapter.upsertMany(state, damageAreas); }
    }).addCase('inspections/gotMany', (
      state: EntityState<NormalizedDamageArea>,
      action: PayloadAction<InspectionPayloadTypes['GotMany'], 'inspections/gotMany'>,
    ) => {
      const { entities } = action.payload;
      const damageAreas = entities[key];
      if (!isEmpty(damageAreas)) { entityAdapter.upsertMany(state, damageAreas); }
    });
  },
});
