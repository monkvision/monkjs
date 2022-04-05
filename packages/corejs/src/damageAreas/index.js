import axios from 'axios';
import isEmpty from 'lodash.isempty';
import mapKeysDeep from 'map-keys-deep-lodash';
import snakeCase from 'lodash.snakecase';

import { normalize } from 'normalizr';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import createEntityReducer from '../createEntityReducer';

import schema, { idAttribute, key } from './schema';
import config from '../config';

/**
 * @param {string} inspectionId
 * @param {string} imageId
 * @param {Object} data - body data
 * @param {string} [data.id]
 * @param {[string]} data.relevantElements
 * @param {Object} requestConfig
 */
export const upsertOne = async ({ inspectionId, imageId, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `inspections/${inspectionId}/images/${imageId}/damage_areas`,
    data: mapKeysDeep(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const id = axiosResponse.data[idAttribute];
  const entity = {
    ...data,
    [idAttribute]: id,
  };

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
  });
};

export const entityAdapter = createEntityAdapter({});
export const entityReducer = createEntityReducer(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder
      .addCase(`images/gotOne`, (state, action) => {
        const { entities } = action.payload;
        const damageArea = entities[key];
        if (damageArea) { entityAdapter.upsertOne(state, damageArea); }
      })
      .addCase(`images/gotMany`, (state, action) => {
        const { entities } = action.payload;
        const damageAreas = entities[key];
        if (!isEmpty(damageAreas)) { entityAdapter.upsertMany(state, damageAreas); }
      })
      .addCase(`inspections/gotOne`, (state, action) => {
        const { entities } = action.payload;
        const damageAreas = entities[key];
        if (!isEmpty(damageAreas)) { entityAdapter.upsertMany(state, damageAreas); }
      })
      .addCase(`inspections/gotMany`, (state, action) => {
        const { entities } = action.payload;
        const damageAreas = entities[key];
        if (!isEmpty(damageAreas)) { entityAdapter.upsertMany(state, damageAreas); }
      });
  },
});
