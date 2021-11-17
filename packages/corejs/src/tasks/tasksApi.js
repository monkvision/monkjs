import axios from 'axios';

/**
 * @name createOneInspection
 * Adds image to an existing inspection.
 * You must provide the id of the concerned inspection
 * The method returns a unique image id.
 *
 * @link https://api.preview.monk.ai/v1/apidocs/#/Image/add_image_to_inspection
 *
 * @param {string} inspectionId
 * @param {Object} data - body data
 *
 * @param {string} [baseUrl]
 * @param {Object} [axiosRequestConfig]
 *
 * @returns {Promise}
 */
// eslint-disable-next-line import/prefer-default-export
export function updateOne({
  inspectionId, taskName, data, baseUrl, ...axiosRequestConfig
}) {
  return axios.request({
    method: 'patch',
    url: `${baseUrl}/inspections/${inspectionId}/tasks/${taskName}`,
    data,
    ...axiosRequestConfig,
  }).catch((e) => console.error(e));
}
