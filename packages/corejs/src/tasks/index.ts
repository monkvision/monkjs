import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
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

/**
 * Define the retry configuration for API calls to update the tasks
 */
const MAX_RETRY_ATTEMPTS = 4;
const RETRY_CONFIG = {
  retries: MAX_RETRY_ATTEMPTS,
  retryDelay: (retryCount: number) => axiosRetry.exponentialDelay(retryCount),
  // shouldResetTimeout: true,
  retryCondition: (error: AxiosError) => {
    // Check if the error response is in a range of server error status codes (5xx)
    const hasServerError = error.response && error.response.status >= 500 && error.response.status <= 599;

    // Check if the error is a CORS error
    const isCorsError = /cors/i.test(error.message);

    // Check if the error is a network or idempotent request error
    const isNetworkError = axiosRetry.isNetworkOrIdempotentRequestError(error);

    // Add a custom check for specific error messages
    const isCustomNetworkError = error.message && error.message === 'Network Error';

    // Check for other common conditions that you might want to retry
    const shouldRetry = hasServerError
      || isCorsError
      || isNetworkError
      || isCustomNetworkError;

    return shouldRetry;
  },
};

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
   * Create an Axios instance
   * Apply axios-retry to Axios instance
   */
  const axiosInstance = axios.create();
  axiosRetry(axiosInstance, RETRY_CONFIG);

  /**
   * Make the request with axios.request
   */
  const axiosResponse = await axiosInstance.request<IdResponse<'id'>>({
    ...config.axiosConfig,
    method: 'patch',
    url: `/inspections/${inspectionId}/tasks/${name}`,
    data: mapKeysDeep(updateTask, (v, k) => snakeCase(k)),
  });

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
