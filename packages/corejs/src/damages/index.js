import axios from 'axios';
import mapKeysDeep from 'map-keys-deep-lodash';
import snakeCase from 'lodash.snakecase';
import isEmpty from 'lodash.isempty';

import { normalize } from 'normalizr';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import createEntityReducer from '../createEntityReducer';

import schema, { idAttribute, key } from './schema';
import config from '../config';

/**
 * @param {string} inspectionId
 * @param {Object} data - body data
 * @param {string} data.damageType
 * @param {string} data.partType
 * @param {Object} requestConfig
 */
export const createOne = async ({ inspectionId, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections/${inspectionId}/damages`,
    data: mapKeysDeep(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const id = axiosResponse.data[idAttribute];
  const entity = { ...data, [idAttribute]: id };

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
  });
};

/**
 * @param {string} inspectionId
 * @param {string} id
 * @param {Object} requestConfig
 */
export const deleteOne = async ({ inspectionId, id, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'delete',
    url: `/inspections/${inspectionId}/damages/${id}`,
    ...requestConfig,
  });

  const entity = { deleted: true, [idAttribute]: id };

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

export const selectors = entityAdapter.getSelectors((state) => state[key]);

entityReducer[`inspections/gotOne`] = (state, action) => {
  const { entities } = action.payload;
  const damages = entities[key];
  if (!isEmpty(damages)) { entityAdapter.upsertMany(state, damages); }
};

export const TYPES = {
  bodyCrack: 'body_crack',
  brokenGlass: 'broken_glass',
  brokenLight: 'broken_light',
  dent: 'dent',
  dirt: 'dirt',
  hubcapScratch: 'hubcap_scratch',
  misshape: 'misshape',
  missingHubcap: 'missing_hubcap',
  missingPiece: 'missing_piece',
  paintPeeling: 'paint_peeling',
  rustiness: 'rustiness',
  scatteredScratches: 'scattered_scratches',
  scratch: 'scratch',
  smash: 'smash',
  lightReflection: 'light_reflection',
  shadow: 'shadow',
  carCurve: 'car_curve',
};
