import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import snakeCase from 'lodash.snakecase';
import { normalize, schema as Schema } from 'normalizr';
import config from '../config';
import createEntityReducer from '../createEntityReducer';
import { schema as damageArea } from '../damageAreas';
import { schema as view } from '../views';

export const key = 'images';
export const idAttribute = 'id';
const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export const schema = new Schema.Entity(key, {
  damageArea,
  views: [view],
}, { idAttribute, processStrategy });

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
    params: mapKeys(params, (v, k) => snakeCase(k)),
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
 * @param {Object} [data.compliances.iqa_compliance={}]
 * @param {Object} [data.compliances.coverage_360]
 * @param {string} [data.compliances.coverage_360.sight_id]
 * @param {Object} requestConfig
 */
export const createOne = async ({ inspectionId, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections/${inspectionId}/images`,
    data: mapKeys(data, (v, k) => snakeCase(k)),
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
