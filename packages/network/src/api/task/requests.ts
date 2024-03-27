import ky from 'ky';
import { MonkActionType, MonkUpdatedManyTasksAction } from '@monkvision/common';
import { ProgressStatus, TaskName } from '@monkvision/types';
import { Dispatch } from 'react';
import { getDefaultOptions, MonkAPIConfig } from '../config';
import { ApiIdColumn } from '../models';
import { MonkApiResponse } from '../types';

/**
 * The different progress statuses that can be specified when updating the status of a task.
 */
export type UpdateProgressStatus =
  | ProgressStatus.NOT_STARTED
  | ProgressStatus.TODO
  | ProgressStatus.DONE
  | ProgressStatus.VALIDATED;

/**
 * Options used to specify how to update the status of an inspection task.
 */
export interface UpdateTaskStatusOptions {
  /**
   * The ID of the inspection.
   */
  inspectionId: string;
  /**
   * The name of the task to update the progress status of.
   */
  name: TaskName;
  /**
   * The new progress status of the task.
   */
  status: UpdateProgressStatus;
}

/**
 * Update the progress status of an inspection task.
 *
 * **Note : This API call is known to sometimes fail for unknown reasons. In order to fix this, we added a retry config
 * to this API request : when failing, this request will retry itself up to 4 times (5 API calls in total), with
 * exponentially increasing delay between each request (max delay : 1.5s).**
 *
 * @param options The options of the request.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 */
export async function updateTaskStatus(
  options: UpdateTaskStatusOptions,
  config: MonkAPIConfig,
  dispatch?: Dispatch<MonkUpdatedManyTasksAction>,
): Promise<MonkApiResponse> {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.patch(`inspections/${options.inspectionId}/tasks/${options.name}`, {
    ...kyOptions,
    json: { status: options.status },
    retry: {
      methods: ['patch'],
      limit: 4,
      backoffLimit: 1500,
    },
  });
  const body = await response.json<ApiIdColumn>();
  dispatch?.({
    type: MonkActionType.UPDATED_MANY_TASKS,
    payload: [{ id: body.id, status: options.status }],
  });
  return {
    id: body.id,
    response,
    body,
  };
}

/**
 * Options passed to the `startInspectionTasks` API request.
 */
export interface StartInspectionTasksOptions {
  /**
   * The ID of the inspection.
   */
  inspectionId: string;
  /**
   * The names of the tasks to start.
   */
  names: TaskName[];
}

/**
 * Start some inspection tasks that were in the NOT_STARTED status. This function actually makes one API call for each
 * task provided using the `updateTaskStatus`.
 *
 * **Note : This API call is known to sometimes fail for unknown reasons. Please take note of the details provided in
 * the TSDoc of the `updateTaskStatus` function.**
 *
 * @param options The options of the request.
 * @param config The API config.
 * @param [dispatch] Optional MonkState dispatch function that you can pass if you want this request to handle React
 * state management for you.
 *
 * @see updateTaskStatus
 */
export async function startInspectionTasks(
  options: StartInspectionTasksOptions,
  config: MonkAPIConfig,
  dispatch?: Dispatch<MonkUpdatedManyTasksAction>,
): Promise<MonkApiResponse[]> {
  const responses = await Promise.all(
    options.names.map((name) =>
      updateTaskStatus(
        { inspectionId: options.inspectionId, name, status: ProgressStatus.TODO },
        config,
      ),
    ),
  );
  dispatch?.({
    type: MonkActionType.UPDATED_MANY_TASKS,
    payload: responses.map((response) => ({ id: response.id, status: ProgressStatus.TODO })),
  });
  return responses;
}
