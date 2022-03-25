import axios from 'axios';
import config from '../config';

/**
 * @name addOneImageToInspection
 * Adds image to an existing inspection.
 * You must provide the id of the concerned inspection
 * The method returns a unique image id.
 *
 * @link https://api.monk.ai/v1/apidocs/#/Image/add_image_to_inspection
 *
 * @param {string} inspectionId
 * @param {Object} data - body data
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function addOne({ inspectionId, data, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'post',
    url: `/inspections/${inspectionId}/images`,
    data,
    ...customReqConfig,
  });
}

/**
 * @name getOneImageById
 * Permissions to access resources owned by user:
 * monk_core_api:inspections:read
 * Permissions to access resources whose owner share the user's organization:
 * monk_core_api:inspections:read_organization
 *
 *
 * @param {string} inspectionId
 * @param {string} imageId
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function getOne({ inspectionId, imageId, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'get',
    url: `/inspections/${inspectionId}/images/${imageId}`,
    ...customReqConfig,
  });
}
