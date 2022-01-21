/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import config from '../config';

/**
 * @name updateOneInspectionVehicle
 *
 * @param {string} inspectionId
 * @param {Object} data - body data
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function updateOne({ inspectionId, data, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'patch',
    url: `/inspections/${inspectionId}/vehicle`,
    data,
    ...customReqConfig,
  });
}
