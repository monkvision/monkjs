import axios from 'axios';
import isEmpty from 'lodash.isempty';
import mapKeysDeep from 'map-keys-deep-lodash';
import snakeCase from 'lodash.snakecase';

import { normalize } from 'normalizr';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import createEntityReducer from '../createEntityReducer';

import schema, { idAttribute, key } from './schema';
import config from '../config';

export const name = key;

/**
 * @param {string} id
 * @param {Object} [params]
 * @param {boolean} [params.showDeletedObjects=false]
 * @param {Object} requestConfig
 */
export const getOne = async ({ id, params, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${id}`,
    params: mapKeysDeep(params, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  /**
   * Note(Ilyass): Since there is still a bug from BE, which is wheel_analysis property
   * is always null, as a workaround we are pulling wheel_analysis from images, and wheelName
   * from tasks.images.details.wheel_name
  *  */
  const wheelAnalysisTask = axiosResponse.data.tasks.find((task) => task.name === 'wheel_analysis');
  const getTaskImageById = (imageId) => wheelAnalysisTask.images.find(
    (img) => img.image_id === imageId,
  );
  const wheelName = (imageId) => getTaskImageById(imageId)?.details?.wheel_name;

  const wheelAnalysisFromImages = axiosResponse.data.images
    ?.filter((img) => img?.wheel_analysis)
    .map((img) => ({ ...img?.wheel_analysis, wheel_name: wheelName(img.id) }));

  const data = {
    ...axiosResponse.data,
    wheel_analysis: axiosResponse.data.wheelAnalysis ?? wheelAnalysisFromImages,
  };

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(data, schema),
  });
};

/**
 * @param {Object} params - query params
 * @param {number} [params.limit=100]
 * @param {$uuid: {string}} [params.before]
 * @param {$uuid: {string}} [params.after]
 * @param {"asc"|"desc"} [params.paginationOrder="desc"]
 * @param {string} [params.inspectionStatus]
 * @param {boolean} [params.allInspections=false]
 * @param {boolean} [params.allInspectionsInOrganization=false]
 * @param {number} [params.verbose=0]
 * @param {Object} [requestConfig]
 */
export const getMany = async ({ params, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections`,
    params: mapKeysDeep(params, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  return ({
    axiosResponse,
    ...normalize(axiosResponse.data.data, [schema]),
  });
};

/**
 * @param {Object} data - body data
 * @param {string} data.id
 * @param {Object} data.tasks - task entity
 * @param {Object} [data.tasks.damageDetection]
 * @param {Object} [data.tasks.wheelAnalysis]
 * @param {Object} [data.tasks.damageDetection]
 * @param {Object} [data.tasks.imagesOcr]
 * @param {[Object]} data.images - image entity
 * @param {Object} data.vehicle - vehicle entity
 * @param {[Object]} data.damageAreas - damageArea entity
 * @param {Object} requestConfig
 */
export const upsertOne = async ({ data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'post',
    url: `/inspections`,
    data: mapKeysDeep(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const inspection = axiosResponse.data;
  const id = inspection[idAttribute];
  const createdAt = inspection.createdAt || Date.now();
  const entity = { ...data, [idAttribute]: id, createdAt };

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
  });
};

/**
 * @param {string} id
 * @param {Object} data - body data
 * @param {Object} [data.mileage]
 * @param {number} [data.mileage.value]
 * @param {string} [data.mileage.unit]
 * @param {Object} [data.marketValue]
 * @param {number} [data.marketValue.value]
 * @param {string} [data.marketValue.unit]
 * @param {string} [data.agentFirstName]
 * @param {string} [data.agentLastName]
 * @param {string} [data.agentCompany]
 * @param {string} [data.agentCompanyCity]
 * @param {string} [data.vehicleOwnerFirstName]
 * @param {string} [data.vehicleOwnerLastName]
 * @param {string} [data.vehicleOwnerAddress]
 * @param {string} [data.vehicleOwnerPhone]
 * @param {string} [data.vehicleOwnerEmail]
 * @param {string} [data.dateOfStart]
 * @param {string} [data.dateOfValidation]
 * @param {string} [data.vinOrRegistering]
 * @param {string} [data.comment]
 * @param {Object} requestConfig
 */
export const addAdditionalDataToOne = async ({ id, data, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${id}/pdf_data`,
    data: mapKeysDeep(data, (v, k) => snakeCase(k)),
    ...requestConfig,
  });

  const entity = { ...data, [idAttribute]: id };

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
  });
};

/**
 * @param {string} id
 * @param {Object} requestConfig
 */
export const deleteOne = async ({ id, ...requestConfig }) => {
  const axiosResponse = await axios.request({
    ...config.axiosConfig,
    method: 'delete',
    url: `/inspections/${id}`,
    ...requestConfig,
  });

  const entity = { deleted: true, [idAttribute]: id };

  return ({
    axiosResponse,
    [idAttribute]: id,
    ...normalize(entity, schema),
  });
};

export const entityAdapter = createEntityAdapter({});
export const entityReducer = createEntityReducer(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder
      .addCase(`tasks/gotOne`, (state, action) => {
        const { entities, result, inspectionId } = action.payload;
        const task = entities.tasks[result];

        if (inspectionId && !isEmpty(task)) {
          const inspection = state.entities[inspectionId]
            || { [idAttribute]: inspectionId, tasks: [] };

          entityAdapter.upsertOne(state, {
            ...inspection,
            tasks: [
              ...inspection.tasks,
              task,
            ],
          });
        }
      })
      .addCase(`images/gotOne`, (state, action) => {
        const { entities, result } = action.payload;
        const image = entities[result];
        const inspection = state.entities[image.inspection] || { images: [] };
        const newInspection = { ...inspection, images: [...inspection.images, result] };
        if (!isEmpty(inspection)) { entityAdapter.upsertOne(state, newInspection); }
      });
  },
});
