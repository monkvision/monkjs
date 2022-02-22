import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import snakeCase from 'lodash.snakecase';
import normalizr, { normalize } from 'normalizr';
import config from '../config';
import createEntityReducer from '../createEntityReducer';

export const key = 'damageAreas';
export const idAttribute = 'id';
const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export const schema = new normalizr.schema.Entity(key, {}, { idAttribute, processStrategy });

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
    data: mapKeys(data, (v, k) => snakeCase(k)),
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

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
});
