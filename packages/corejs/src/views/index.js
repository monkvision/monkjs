import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import snakeCase from 'lodash.snakecase';
import normalizr, { normalize } from 'normalizr';
import config from '../config';
import createEntityReducer from '../createEntityReducer';

export const key = 'views';
export const idAttribute = 'id';
const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export const schema = new normalizr.schema.Entity(key, {}, { idAttribute, processStrategy });

/**
 * @param {string} inspectionId
 * @param {Object} data - body data
 * @param {string} [data.imageId]
 * @param {string} [data.damageId]
 * @param {[[[number]]]} [data.polygons]
 * @param {Object} [data.boundingBox]
 * @param {number} [data.boundingBox.width]
 * @param {number} [data.boundingBox.height]
 * @param {Object} [data.newImage]
 * @param {string} [data.newImage.name]
 * @param {string} [data.newImage.rotate_image_before_upload]
 * @param {Object} requestConfig
 */
export const createOne = async ({ inspectionId, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections/${inspectionId}/views`,
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

/**
 * @param {string} id
 * @param {string} inspectionId
 * @param {Object} requestConfig
 */
export const deleteOne = async ({ id, inspectionId, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'delete',
    url: `/inspections/${inspectionId}/views/${id}`,
    ...requestConfig,
  });

  const entity = { deleted: true, [idAttribute]: id };

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
