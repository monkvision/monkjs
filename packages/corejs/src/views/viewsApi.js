import axios from 'axios';
import config from '../config';

/**
 * @name addOneViewToInspection
 * Adds view to an existing inspection.
 * You must provide the id of the concerned inspection
 * The method returns a unique view id.
 *
 * @link https://api.staging.monk.ai/v1/apidocs/#/View/post_view
 *
 * @param {string} inspectionId
 * @param {Object} data - body data
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
// eslint-disable-next-line import/prefer-default-export
export function addOne({ inspectionId, data, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'post',
    url: `/inspections/${inspectionId}/views`,
    data,
    ...customReqConfig,
  });
}

/**
 * @name deleteOneView
 * @param {$uuid: {string}} id
 * @param {$uuid: {string}} inspectionId
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function deleteOne({ id, inspectionId, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'delete',
    url: `/inspections/${inspectionId}/views/${id}`,
    ...customReqConfig,
  });
}
