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

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
});
