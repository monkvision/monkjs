import axios from 'axios';
import config from '../config';

/**
 * @name addOneImageToInspection
 * Adds image to an existing inspection.
 * You must provide the id of the concerned inspection
 * The method returns a unique image id.
 *
 * @link https://api.preview.monk.ai/v1/apidocs/#/Image/add_image_to_inspection
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
    url: `/inspections/${inspectionId}/images`,
    data,
    ...customReqConfig,
  });
}
