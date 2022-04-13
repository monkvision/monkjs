import axios from 'axios';
import isEmpty from 'lodash.isempty';
import mapKeysDeep from 'map-keys-deep-lodash';
import snakeCase from 'lodash.snakecase';

import { normalize } from 'normalizr';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import createEntityReducer from '../createEntityReducer';

import schema, { idAttribute, key } from './schema';
import config from '../config';

export const NAMES = {
  damageDetection: 'damage_detection',
  repairEstimate: 'repair_estimate',
  wheelAnalysis: 'wheel_analysis',
};

export const STATUSES = {
  aborted: 'ABORTED',
  done: 'DONE',
  error: 'ERROR',
  inProgress: 'IN_PROGRESS',
  notStarted: 'NOT_STARTED',
  todo: 'TODO',
  validated: 'VALIDATED',
};

/**
 * @param {string} inspectionId
 * @param {string} name
 * @param {Object} requestConfig
 */
export const getOne = async ({ inspectionId, name, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${inspectionId}/task/${name}`,
    ...requestConfig,
  });

  return ({
    axiosResponse,
    inspectionId,
    [idAttribute]: name,
    ...normalize(axiosResponse.data, schema),
  });
};

/**
 * @param {string} inspectionId
 * @param {Object} [requestConfig]
 */
export const getMany = async ({ inspectionId, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${inspectionId}/tasks`,
    ...requestConfig,
  });

  return ({
    axiosResponse,
    inspectionId,
    ...normalize(axiosResponse.data, [schema]),
  });
};

/**
 * @param {string} inspectionId
 * @param {string} name
 * @param {Object} data - body data
 * @param {string} data.status
 * @param {Object} requestConfig
 */
export const updateOne = async ({
  inspectionId,
  name,
  data,
  ...requestConfig
}) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${inspectionId}/tasks/${name}`,
    data: mapKeysDeep(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const id = axiosResponse.data[idAttribute];
  const entity = { ...data, [idAttribute]: id, name };

  return ({
    axiosResponse,
    [idAttribute]: id,
    inspectionId,
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
        const tasks = entities[key];
        if (!isEmpty(tasks)) { entityAdapter.upsertMany(state, tasks); }
      })
      .addCase(`inspections/gotMany`, (state, action) => {
        const { entities } = action.payload;
        const tasks = entities[key];
        if (!isEmpty(tasks)) { entityAdapter.upsertMany(state, tasks); }
      });
  },
});
