import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import snakeCase from 'lodash.snakecase';
import { normalize, schema as Schema } from 'normalizr';
import config from '../config';
import createEntityReducer from '../createEntityReducer';
import { schema as damage } from '../damages';
import { schema as image } from '../images';
import { schema as task } from '../tasks';
import { schema as vehicle } from '../vehicles';

export const key = 'inspections';
export const idAttribute = 'id';
const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export const schema = new Schema.Entity(key, {
  images: [image],
  damages: [damage],
  vehicle,
  tasks: [task],
}, { idAttribute, processStrategy });

/**
 * @param {string} id
 * @param {Object} [params]
 * @param {boolean} [params.showDeletedObjects=false]
 * @param {Object} requestConfig
 */
export const getOne = async ({ id, params, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${id}`,
    params: mapKeys(params, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(axiosResponse.data, schema),
  });
};

/**
 * @param {Object} params - query params
 * @param {number} [params.limit=100]
 * @param {$uuid: {string}} [params.before]
 * @param {$uuid: {string}} [params.after]
 * @param {"asc"|"desc"} [params.paginationOrder="desc"]
 * @param {string} [params.inspectionStatus]
 * @param {boolean} [params.allInspections=false]
 * @param {boolean} [params.allInspectionsInOrganization=false]
 * @param {number} [params.verbose=0]
 * @param {Object} [requestConfig]
 */
export const getMany = async ({ params, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections`,
    params: mapKeys(params, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  return ({
    axiosResponse,
    ...normalize(axiosResponse.data.data, [schema]),
  });
};

/**
 * @param {Object} data - body data
 * @param {Object} data.tasks - task entity
 * @param {Object} [data.tasks.damage_detection]
 * @param {Object} [data.tasks.wheel_analysis]
 * @param {Object} [data.tasks.damage_detection]
 * @param {Object} [data.tasks.images_ocr]
 * @param {[Object]} data.images - image entity
 * @param {Object} data.vehicle - vehicle entity
 * @param {[Object]} data.damageAreas - damageArea entity
 * @param {Object} requestConfig
 */
export const createOne = async ({ data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections`,
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
 * @param {Object} data - body data
 * @param {string} data.id
 * @param {Object} data.tasks - task entity
 * @param {Object} [data.tasks.damage_detection]
 * @param {Object} [data.tasks.wheel_analysis]
 * @param {Object} [data.tasks.damage_detection]
 * @param {Object} [data.tasks.images_ocr]
 * @param {[Object]} data.images - image entity
 * @param {Object} data.vehicle - vehicle entity
 * @param {[Object]} data.damageAreas - damageArea entity
 * @param {Object} requestConfig
 */
export const upsertOne = async ({ data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections`,
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

/**
 * @param {string} id
 * @param {Object} data - body data
 * @param {Object} [data.mileage]
 * @param {number} [data.mileage.value]
 * @param {string} [data.mileage.unit]
 * @param {Object} [data.marketValue]
 * @param {number} [data.marketValue.value]
 * @param {string} [data.marketValue.unit]
 * @param {string} [data.agentFirstName]
 * @param {string} [data.agentLastName]
 * @param {string} [data.agentCompany]
 * @param {string} [data.agentCompanyCity]
 * @param {string} [data.vehicleOwnerFirstName]
 * @param {string} [data.vehicleOwnerLastName]
 * @param {string} [data.vehicleOwnerAddress]
 * @param {string} [data.vehicleOwnerPhone]
 * @param {string} [data.vehicleOwnerEmail]
 * @param {string} [data.dateOfStart]
 * @param {string} [data.dateOfValidation]
 * @param {string} [data.vinOrRegistering]
 * @param {string} [data.comment]
 * @param {Object} requestConfig
 */
export const addAdditionalDataToOne = async ({ id, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${id}/pdf_data`,
    data: mapKeys(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const entity = { ...data, [idAttribute]: id };

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
  });
};

/**
 * @param {string} id
 * @param {Object} requestConfig
 */
export const deleteOne = async ({ id, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'delete',
    url: `/inspections/${id}`,
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
