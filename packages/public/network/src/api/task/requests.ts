import ky from 'ky';
import { MonkActionType, MonkUpdatedManyTasksAction } from '@monkvision/common';
import { ProgressStatus, TaskName } from '@monkvision/types';
import { getDefaultOptions, MonkAPIConfig } from '../config';
import { ApiIdColumn } from '../models';
import { MonkAPIRequest } from '../types';

/**
 * The different progress statuses that can be specified when updating the status of a task.
 */
export type UpdateProgressStatus =
  | ProgressStatus.NOT_STARTED
  | ProgressStatus.TODO
  | ProgressStatus.DONE
  | ProgressStatus.VALIDATED;

/**
 * Update the progress status of an inspection task.
 *
 * **Note : This API call is known to sometimes fail for unknown reasons. In order to fix this, we added a retry config
 * to this API request : when failing, this request will retry itself up to 4 times (5 API calls in total), with
 * exponentially increasing delay between each request (max delay : 1.5s).**
 *
 * @param inspectionId The ID of the inspection.
 * @param name The name of the task to update the progress status of.
 * @param status The new progress status of the task.
 * @param config The API config.
 */
export const updateTaskStatus: MonkAPIRequest<
  [inspectionId: string, name: TaskName, status: UpdateProgressStatus],
  MonkUpdatedManyTasksAction
> = async (
  inspectionId: string,
  name: TaskName,
  status: UpdateProgressStatus,
  config: MonkAPIConfig,
) => {
  const kyOptions = getDefaultOptions(config);
  const response = await ky.patch(`inspections/${inspectionId}/tasks/${name}`, {
    ...kyOptions,
    json: { status },
    retry: {
      methods: ['patch'],
      limit: 4,
      backoffLimit: 1500,
    },
  });
  const body = await response.json<ApiIdColumn>();
  return {
    action: {
      type: MonkActionType.UPDATED_MANY_TASKS,
      payload: [{ id: body.id, status }],
    },
    response,
    body,
  };
};

/**
 * Start some inspection tasks that were in the NOT_STARTED status. This function actually makes one API call for each
 * task provided using the `updateTaskStatus`.
 *
 * **Note : This API call is known to sometimes fail for unknown reasons. Please take note of the details provided in
 * the TSDoc of the `updateTaskStatus` function.**
 *
 * @param inspectionId The ID of the inspection.
 * @param names The names of the task to start.
 * @param config The API config.
 *
 * @see updateTaskStatus
 */
export const startInspectionTasks: MonkAPIRequest<
  [inspectionId: string, names: TaskName[]],
  MonkUpdatedManyTasksAction
> = async (inspectionId: string, names: TaskName[], config: MonkAPIConfig) => {
  const responses = await Promise.all(
    names.map((name) => updateTaskStatus(inspectionId, name, ProgressStatus.TODO, config)),
  );
  return {
    action: {
      type: MonkActionType.UPDATED_MANY_TASKS,
      payload: responses.map((res) => res.action.payload[0]),
    },
    response: responses[0].response,
    body: responses[0].body,
  };
};
