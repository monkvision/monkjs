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
 * @param {Object} data - body data
 * @param {string} data.brand
 * @param {string} data.model
 * @param {string} data.plate
 * @param {string} data.vehicleType
 * @param {string} data.vin
 * @param {string} data.color
 * @param {string} data.exteriorCleanliness
 * @param {string} data.interiorCleanliness
 * @param {string} data.dateOfCirculation
 * @param {Object} data.mileage
 * @param {number} data.mileage.value
 * @param {string} data.mileage.unit
 * @param {Object} data.marketValue
 * @param {number} data.mileage.value
 * @param {string} data.mileage.unit
 * @param {Object} requestConfig
 */
export const updateOne = async ({ inspectionId, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${inspectionId}/vehicle`,
    data: mapKeysDeep(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const id = data[idAttribute];
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
      .addCase(`inspections/gotOne`, (state, action) => {
        const { entities } = action.payload;
        const vehicle = entities[key];
        if (vehicle) { entityAdapter.upsertOne(state, vehicle); }
      })
      .addCase(`inspections/gotMany`, (state, action) => {
        const { entities } = action.payload;
        const vehicles = entities[key];
        if (!isEmpty(vehicles)) { entityAdapter.upsertMany(state, vehicles); }
      });
  },
});