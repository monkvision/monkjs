import axios from 'axios';
import config from '../config';

/**
 * @name updateOneTaskOfInspection
 *
 * @param {string} inspectionId
 * @param {string} taskName
 * @param {Object} data - body data
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
// eslint-disable-next-line import/prefer-default-export
export function updateOne({ inspectionId, taskName, data, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'patch',
    url: `/inspections/${inspectionId}/tasks/${taskName}`,
    data,
    ...customReqConfig,
  });
}
