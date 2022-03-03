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
 * @param {Object} params - query params
 * @param {number} [params.limit=100]
 * @param {$uuid: {string}} [params.before]
 * @param {$uuid: {string}} [params.after]
 * @param {"asc"|"desc"} [params.paginationOrder="desc"]
 * @param {Object} [requestConfig]
 */
export const getMany = async ({ inspectionId, params, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${inspectionId}/images`,
    params: mapKeysDeep(params, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  return ({
    axiosResponse,
    inspectionId,
    ...normalize(axiosResponse.data.data, [schema]),
  });
};

/**
 * @param {string} inspectionId
 * @param {Object} data - body data
 * @param {string} [data.name]
 * @param {Object} data.acquisition
 * @param {string} data.acquisition.strategy
 * @param {string} [data.acquisition.fileKey]
 * @param {string} [data.acquisition.url]
 * @param {[Object]} data.tasks
 * @param {Object} [data.damageArea]
 * @param {Object} [data.additionalData]
 * @param {Object} [data.compliances]
 * @param {Object} [data.compliances.iqaCompliance={}]
 * @param {Object} [data.compliances.coverage360]
 * @param {string} [data.compliances.coverage360.sightId]
 * @param {Object} requestConfig
 */
export const createOne = async ({ inspectionId, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections/${inspectionId}/images`,
    data: mapKeysDeep(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const id = axiosResponse.data[idAttribute];
  const entity = { ...data, [idAttribute]: id, inspection: { id: inspectionId } };

  return ({
    axiosResponse,
    inspectionId,
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
