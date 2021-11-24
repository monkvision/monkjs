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
export function updateOne({ inspectionId, taskName, data, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'patch',
    url: `/inspections/${inspectionId}/tasks/${taskName}`,
    data,
    ...customReqConfig,
  });
}

/**
 * @name getOnInspectionTask
 *
 * @param {string} inspectionId
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function getOne({ inspectionId, taskName, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'get',
    url: `/inspections/${inspectionId}/tasks/${taskName}`,
    ...customReqConfig,
  });
}

/**
 * @name getAllInspectionTasks
 *
 * @param {string} inspectionId
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function getAll({ inspectionId, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);
  return http.request({
    method: 'get',
    url: `/inspections/${inspectionId}/tasks`,
    ...customReqConfig,
  });
}
