import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { isEmpty, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

import { normalize } from 'normalizr';
import config from '../config';

import createEntityReducer from '../createEntityReducer';
import { InspectionPayloadTypes } from '../inspections/reduxTypes';
import { IdResponse, RootState } from '../sharedTypes';
import { CreateDamage, CreatedDamage, CreateOneDamageResponse, DeleteOneDamageResponse } from './apiTypes';
import { NormalizedDamage } from './entityTypes';
import { DamagePayloadTypes } from './reduxTypes';

import schema, { idAttribute, key } from './schema';

function mapCreatedDamage(id: string, createDamage: CreateDamage): CreatedDamage {
  return {
    id,
    damageType: createDamage.damageType,
  };
}

/**
 * Create a new damage entity in an inspection.
 *
 * @param {string} inspectionId The ID of the inspection.
 * @param {CreateDamage} createDamage The details of the damage to create.
 */
export async function createOne(inspectionId: string, createDamage: CreateDamage): Promise<CreateOneDamageResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections/${inspectionId}/damages`,
    data: mapKeysDeep(createDamage, (v, k) => snakeCase(k)),
  });

  const id = axiosResponse.data[idAttribute];
  const createdEntity = mapCreatedDamage(id, createDamage);

  return {
    axiosResponse,
    [idAttribute]: id,
    ...normalize(createdEntity, schema),
  };
}

/**
 * Delete a damage entity from an inspection.
 *
 * @param {string} inspectionId The ID of the inspeciton this damage belongs to.
 * @param {string} id The ID of the damage to delete.
 */
export async function deleteOne(inspectionId: string, id: string): Promise<DeleteOneDamageResponse> {
  const axiosResponse = await axios.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'delete',
    url: `/inspections/${inspectionId}/damages/${id}`,
  });

  const result = {
    [idAttribute]: id,
  };

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(result, schema),
  });
}

export const entityAdapter = createEntityAdapter<NormalizedDamage>({});
export const entityReducer = createEntityReducer<NormalizedDamage, DamagePayloadTypes>(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder.addCase('inspections/gotOne', (
      state: EntityState<NormalizedDamage>,
      action: PayloadAction<InspectionPayloadTypes['GotOne'], 'inspections/gotOne'>,
    ) => {
      const { entities } = action.payload;
      const damages = entities[key];
      if (!isEmpty(damages)) { entityAdapter.upsertMany(state, damages); }
    }).addCase('inspections/gotMany', (
      state: EntityState<NormalizedDamage>,
      action: PayloadAction<InspectionPayloadTypes['GotMany'], 'inspections/gotMany'>,
    ) => {
      const { entities } = action.payload;
      const damages = entities[key];
      if (!isEmpty(damages)) { entityAdapter.upsertMany(state, damages); }
    });
  },
});
