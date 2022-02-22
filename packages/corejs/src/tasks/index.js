import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import snakeCase from 'lodash.snakecase';
import normalizr, { normalize } from 'normalizr';
import config from '../config';
import createEntityReducer from '../createEntityReducer';
import { idAttribute as imageIdAttr, schema as image } from '../images';

export const key = 'tasks';
export const idAttribute = 'name';
const processStrategy = (obj) => {
  /** @type {{ inspectionId: string, images: Object, parts: Object }} */
  const processed = mapKeys(obj, (v, k) => camelCase(k));

  const { images } = processed;
  processed.images = {};

  images.forEach(({ image_id: imageId }) => {
    processed.parts = { ...processed.images, [imageIdAttr]: imageId };
  });

  return processed;
};

export const schema = new normalizr.schema.Entity(key, {
  images: [image],
}, { idAttribute, processStrategy });

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
    data: mapKeys(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const id = data[idAttribute];
  const entity = { ...data, [idAttribute]: id };

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
