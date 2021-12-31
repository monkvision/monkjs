import axios from 'axios';
import config from '../config';

/**
 * @name createOneDamage
 * Creates new damage.
 * Damage contains data about the result of damage analysis task.
 * You can add some damages manually
 * The method returns a unique damage id.
 *
 * @link https://api.staging.monk.ai/v1/apidocs/#/Damage/post_damage
 *
 * @param {$uuid: {string}} inspectionId
 * @param {Object} data - body data
 * @param {$uuid: {string}} partId
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function createOne({ inspectionId, data, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'post',
    url: `/inspections/${inspectionId}/damages`,
    data,
    ...customReqConfig,
  });
}

/**
 * @name deleteOneDamage
 * @param {$uuid: {string}} id
 * @param {$uuid: {string}} inspectionId
 * @param {$uuid: {string}} partId
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function deleteOne({ id, inspectionId, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'delete',
    url: `/inspections/${inspectionId}/damages/${id}`,
    ...customReqConfig,
  });
}
