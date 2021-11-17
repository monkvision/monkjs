import axios from 'axios';
import config from '../config';

/**
 * @name getOneInspectionById
 *
 * Returns an inspection with all the results when they are ready.
 *  - monk_core_api:inspections:read
 *  - monk_core_api:inspections:read_organization
 *
 * @link https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_inspection
 *
 * @param {$uuid: {string}} id
 * @param {Object} [params]
 * @param {boolean} [params.show_deleted_objects=false]
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function getOne({ id, params, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'get',
    url: `/inspections/${id}`,
    params,
    ...customReqConfig,
  });
}

/**
 * @name getAllInspections
 * Returns all the inspections created by the client / organization.
 *
 * @link https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_all_inspections
 *
 *
 * @param {Object} params - query params
 * @param {number} [params.limit=100]
 * @param {$uuid: {string}} [params.before]
 * @param {$uuid: {string}} [params.after]
 * @param {"asc"|"desc"} [params.pagination_order="desc"]
 * @param {boolean} [params.all_inspections=false]
 * @param {boolean} [params.all_inspections_in_organization=false]
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function getAll({ params, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'get',
    url: `/inspections`,
    params,
    ...customReqConfig,
  });
}

/**
 * @name createOneInspection
 * Creates a new inspection.
 * An inspection contains data about the state of a vehicle at a given time.
 * You must create an inspection with the list of all the tasks
 * you will ever want to apply on this inspection.
 * You can add images directly or add images later.
 * You must specify on the images also what task you want to apply to the image.
 * When a task have started it is too late to edit it
 * or to add more image on which you want to apply task.
 * The method returns a unique inspection id.
 *
 * @link https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_all_inspections
 *
 * @param {Object} data - body data
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function createOne({ data, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);

  return http.request({
    method: 'post',
    url: `/inspections`,
    data,
    ...customReqConfig,
  });
}
