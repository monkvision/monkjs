import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { camelCase, isEmpty, isNil, omitBy, snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

import { normalize } from 'normalizr';
import config from '../config';

import createEntityReducer from '../createEntityReducer';
import { InspectionPayloadTypes } from '../inspections/reduxTypes';
import { IdResponse, ProgressStatus, RootState } from '../sharedTypes';
import {
  GetManyTasksResponse,
  GetOneTaskResponse,
  InspectionTasks,
  UpdatedTask,
  UpdateOneTaskResponse,
  UpdateTask,
} from './apiTypes';
import { NormalizedTask, Task, TaskName } from './entityTypes';
import { TaskPayloadTypes } from './reduxTypes';

import schema, { idAttribute, key } from './schema';

// Define the maximum number of retry attempts
const MAX_RETRY_ATTEMPTS: number = 4;

/**
 * Get the details of a task in a specific inspection.
 *
 * @param {string} inspectionId The id of the inspection.
 * @param {TaskName} name The name of the task to get.
 */
export async function getOne(inspectionId: string, name: TaskName): Promise<GetOneTaskResponse> {
  const axiosResponse = await axios.request<Task>({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${inspectionId}/tasks/${name}`,
  });

  return {
    axiosResponse,
    inspectionId,
    [idAttribute]: axiosResponse.data.id,
    ...normalize(mapKeysDeep(axiosResponse.data, (v, k) => camelCase(k)), schema),
  };
}

/**
 * Get the tasks of an inspection.
 *
 * @param {string} inspectionId The id of the inspection.
 */
export async function getMany(inspectionId: string): Promise<GetManyTasksResponse> {
  const axiosResponse = await axios.request<InspectionTasks>({
    ...config.axiosConfig,
    method: 'get',
    url: `/inspections/${inspectionId}/tasks`,
  });

  const inspectionTasks = mapKeysDeep(axiosResponse.data, (v, k) => camelCase(k));
  const tasks = omitBy([
    inspectionTasks.damageDetection,
    inspectionTasks.wheelAnalysis,
    inspectionTasks.repairEstimate,
    inspectionTasks.imageOcr,
  ], isNil);

  return {
    axiosResponse,
    inspectionId,
    ...normalize(tasks, [schema]),
  };
}

/**
 * Update the state of an inspection task.
 *
 * @param {string} inspectionId The id of the inspection.
 * @param {TaskName} name The name of the task to update.
 * @param {UpdateTask} updateTask The details of new state of the task.
 */
export async function updateOne(
  inspectionId: string,
  name: TaskName,
  updateTask: UpdateTask,
): Promise<UpdateOneTaskResponse> {
  /**
   * Define the retry configuration for this specific call
   */
  const retryConfig = {
    retries: MAX_RETRY_ATTEMPTS,
    retryDelay: (retryCount) => {
      return retryCount * 1000;
    },
    shouldResetTimeout: true,
    retryCondition: (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response:', error.response);
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      console.error('Config:', error.config);
      // Check if the request should be retried
      /**
       * You can specify a condition for retry here
       * For example, retry on network errors or 5xx status codes
       */
      return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status === 500;
    }
  };

  /**
   * Define the configuration for this specific call
   */
  const apiConfig: AxiosRequestConfig = {
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${inspectionId}/tasks/${name}`,
    data: mapKeysDeep(updateTask, (v, k) => snakeCase(k)),
    'axios-retry': retryConfig,
  };

  // Apply axios-retry to the axios object
  axiosRetry(axios, apiConfig['axios-retry']);

  /**
   * Make the request with axios.request
   */
  const axiosResponse = await axios.request<IdResponse<'id'>>(apiConfig);

  const id = axiosResponse.data[idAttribute];
  const updatedTask: UpdatedTask = {
    [idAttribute]: id,
    name,
    status: updateTask.status as unknown as ProgressStatus,
    arguments: updateTask.arguments,
  };

  return {
    axiosResponse,
    [idAttribute]: id,
    inspectionId,
    ...normalize(updatedTask, schema),
  };
}

export const entityAdapter = createEntityAdapter<NormalizedTask>({});
export const entityReducer = createEntityReducer<NormalizedTask, TaskPayloadTypes>(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder.addCase('inspections/gotOne', (
      state: EntityState<NormalizedTask>,
      action: PayloadAction<InspectionPayloadTypes['GotOne'], 'inspections/gotOne'>,
    ) => {
      const { entities } = action.payload;
      const tasks = entities[key];
      if (!isEmpty(tasks)) {
        entityAdapter.upsertMany(state, tasks);
      }
    }).addCase('inspections/gotMany', (
      state: EntityState<NormalizedTask>,
      action: PayloadAction<InspectionPayloadTypes['GotMany'], 'inspections/gotMany'>,
    ) => {
      const { entities } = action.payload;
      const tasks = entities[key];
      if (!isEmpty(tasks)) {
        entityAdapter.upsertMany(state, tasks);
      }
    });
  },
});
