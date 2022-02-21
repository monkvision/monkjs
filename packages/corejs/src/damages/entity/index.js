import axios from 'axios';

import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import normalizr, { normalize } from 'normalizr';

import config from '../../config';

import { schema as inspection, idAttribute as inspectionIdAttr } from '../../inspections/entity';
import { schema as part, idAttribute as partIdAttr } from '../../parts/entity';

export const key = 'damages';
export const idAttribute = 'id';
const processStrategy = (obj) => {
  const processed = mapKeys(obj, (v, k) => camelCase(k));

  processed.inspection = { [inspectionIdAttr]: processed.inspectionId };

  processed.parts = {};
  processed.partIds.forEach((id) => { processed.parts = { ...processed.parts, [partIdAttr]: id }; });
};

export const schema = new normalizr.schema.Entity(key, {
  inspection,
  parts: [part],
}, { idAttribute, processStrategy });

/**
 * @param {string} inspectionId
 * @param {Object} data - body data
 * @param {Object} requestConfig
 */
export const createOne = async ({ inspectionId, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections/${inspectionId}/damages`,
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
    id,
    ...normalize(entity, schema),
  });
};
