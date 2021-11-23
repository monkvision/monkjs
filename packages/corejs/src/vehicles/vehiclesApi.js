import axios from 'axios';
import config from '../config';

/**
 * @name getOneVehicle
 *
 * Returns a vehicle for the given inspection.
 *  - monk_core_api:inspections:read
 *  - monk_core_api:inspections:read_organization
 *
 * @link https://api.preview.monk.ai/v1/apidocs/#/Inspection/get_inspection
 *
 * @param {$uuid: {string}} inspectionId
 * @param {Object} [params]
 * @param {boolean} [params.show_deleted_objects=false]
 * @param {Object} [customReqConfig]
 *
 * @returns {Promise}
 */
export function getOne({ inspectionId, params, ...customReqConfig }) {
  const http = axios.create(config.axiosConfig);
  return http.request({
    method: 'get',
    url: `/inspections/${inspectionId}`,
    params,
    ...customReqConfig,
  });
}

/**
 * @name getAllVehicles
 * WARNING TODO: Provide an endpoint to get vehicles directly from the API
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
    url: `/inspections?inspection_status=DONE`,
    params,
    ...customReqConfig,
  }).then(({ data: result }) => {
    const inspections = result.data ?? [];
    const vehiclesPromises = [];

    inspections?.forEach((inspection) => {
      vehiclesPromises.push(getOne({
        inspectionId: inspection.id,
        ...params,
        ...customReqConfig,
      }));
    });

    return Promise.all(vehiclesPromises)
      .then((promiseResults) => promiseResults.map((promiseResult) => promiseResult.data))
      .then((detailledInspections) => ({
        data: {
          ...result,
          data: detailledInspections?.map((inspection) => ({
            ...inspection.vehicle,
            id: inspection.id,
          })), // because the api doenst provide the vehicle.id
        },
      }));
  });
}

/**
 * @name updateOneVehicle
 * Patch to update vehicle information.
 *
 * @link https://api.preview.monk.ai/v1/apidocs/#/Inspection/edit_inspection_vehicle
 *
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
