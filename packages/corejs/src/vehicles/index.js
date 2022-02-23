import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import snakeCase from 'lodash.snakecase';
import normalizr, { normalize } from 'normalizr';
import config from '../config';
import createEntityReducer from '../createEntityReducer';

export const key = 'vehicles';
export const idAttribute = 'id';
const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export const schema = new normalizr.schema.Entity(key, {}, { idAttribute, processStrategy });

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
    data: mapKeys(data, (v, k) => snakeCase(k)),
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
