import axios from 'axios';

import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import normalizr, { normalize } from 'normalizr';

import config from '../../config';

import { schema as damage } from '../../damages/entity';
import { schema as image } from '../../images/entity';
import { schema as part } from '../../parts/entity';
import { schema as task } from '../../tasks/entity';
import { schema as vehicle } from '../../vehicles/entity';

export const key = 'inspections';
export const idAttribute = 'id';
const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export const schema = new normalizr.schema.Entity(key, {
  images: [image],
  damages: [damage],
  parts: [part],
  vehicle,
  tasks: [task],
}, { idAttribute, processStrategy });

/**
 * @param {string} id
 * @param {Object} [params]
 * @param {boolean} [params.show_deleted_objects=false]
 * @param {Object} requestConfig
 */
export const getOne = async ({ id, params, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${id}`,
    params,
    ...requestConfig,
  });

  return ({
    axiosResponse,
    id,
    ...normalize(axiosResponse.data, schema),
  });
};

/**
 * @param {Object} params - query params
 * @param {number} [params.limit=100]
 * @param {$uuid: {string}} [params.before]
 * @param {$uuid: {string}} [params.after]
 * @param {"asc"|"desc"} [params.pagination_order="desc"]
 * @param {boolean} [params.all_inspections=false]
 * @param {boolean} [params.all_inspections_in_organization=false]
 * @param {Object} [requestConfig]
 */
export const getMany = async ({ params, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections`,
    params,
    ...requestConfig,
  });

  return ({
    axiosResponse,
    ...normalize(axiosResponse.data, [schema]),
  });
};

/**
 * @param {Object} data - body data
 * @param {Object} requestConfig
 */
export const createOne = async ({ data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections`,
    data,
    ...requestConfig,
  });

  const id = axiosResponse.data[idAttribute];
  const entity = { ...data, [idAttribute]: id };

  return ({
    axiosResponse,
    id,
    ...normalize(entity, schema),
  });
};

/**
 * @param {Object} data - body data
 * @param {Object} requestConfig
 */
export const updateOne = async ({ data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections`,
    data,
    ...requestConfig,
  });

  const id = data[idAttribute];
  const entity = { ...data, [idAttribute]: id };

  return ({
    axiosResponse,
    id,
    ...normalize(entity, schema),
  });
};

/**
 * @param {string} id
 * @param {Object} data - body data
 * @param {Object} requestConfig
 */
export const addAdditionalDataToOne = async ({ id, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${id}/pdf_data`,
    data,
    ...requestConfig,
  });

  const entity = { ...data, [idAttribute]: id };

  return ({
    axiosResponse,
    id,
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
    id,
    ...normalize(entity, schema),
  });
};
