import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import snakeCase from 'lodash.snakecase';
import { normalize, schema as Schema } from 'normalizr';
import config from '../config';
import createEntityReducer from '../createEntityReducer';
import { idAttribute as partIdAttr, schema as part } from '../parts';

export const key = 'damages';
export const idAttribute = 'id';
const processStrategy = (obj) => {
  /** @type {{ inspectionId: string, partIds: [string], parts: Object }} */
  const processed = mapKeys(obj, (v, k) => camelCase(k));
  processed.parts = {};
  processed.partIds.forEach((id) => {
    processed.parts = { ...processed.parts, [partIdAttr]: id };
  });

  return processed;
};

export const schema = new Schema.Entity(key, {
  parts: [part],
}, { idAttribute, processStrategy });

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
    data: mapKeys(data, (v, k) => snakeCase(k)),
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
