import axios from 'axios';
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

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
});
