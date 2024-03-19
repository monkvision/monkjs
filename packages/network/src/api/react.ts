import { Dispatch, useCallback } from 'react';
import { MonkAction, useMonkState } from '@monkvision/common';
import { MonkAPIConfig } from './config';
import { MonkAPIRequest, MonkApiResponse } from './types';
import { ApiIdColumn } from './models';
import { MonkApi } from './api';

function reactifyRequest<
  A extends unknown[],
  T extends MonkAction | null,
  K extends object = ApiIdColumn,
  P extends object = Record<never, never>,
>(
  request: MonkAPIRequest<A, T, K, P>,
  config: MonkAPIConfig,
  dispatch: Dispatch<MonkAction>,
): (...args: A) => Promise<MonkApiResponse<T, K, P>> {
  return useCallback(async (...args: A) => {
    const result = await request(...args, config);
    if (result.action) {
      dispatch(result.action);
    }
    return result;
  }, []);
}

/**
 * Custom hook that returns a MonkApi object in which all the requests don't need a config param (since it is provided
 * as a prop to this hook), and automatically update the state (using the MonkState hook) when a state has been
 * received.
 *
 * **Note: This hook needs to have the MonkContext set up and defined in order to work properly.**
 *
 * @see MonkApi
 */
export function useMonkApi(config: MonkAPIConfig) {
  const { dispatch } = useMonkState();

  return {
    /**
     * Fetch the details of an inspection using its ID. The resulting action of this request will contain the list of
     * every entity that has been fetched using this API call.
     *
     * @param id The ID of the inspection.
     */
    getInspection: reactifyRequest(MonkApi.getInspection, config, dispatch),
    /**
     * Create a new inspection with the given options. See the `CreateInspectionOptions` interface for more details.
     *
     * @param options The options of the inspection.
     * @see CreateInspectionOptions
     */
    createInspection: reactifyRequest(MonkApi.createInspection, config, dispatch),
    /**
     * Add a new image to an inspection. The resulting action of this request will contain the details of the image that
     * has been created in the API.
     *
     * @param options Upload options for the image.
     */
    addImage: reactifyRequest(MonkApi.addImage, config, dispatch),
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
     */
    updateTaskStatus: reactifyRequest(MonkApi.updateTaskStatus, config, dispatch),
    /**
     * Start some inspection tasks that were in the NOT_STARTED status. This function actually makes one API call for each
     * task provided using the `updateTaskStatus`.
     *
     * **Note : This API call is known to sometimes fail for unknown reasons. Please take note of the details provided in
     * the TSDoc of the `updateTaskStatus` function.**
     *
     * @param inspectionId The ID of the inspection.
     * @param names The names of the task to start.
     *
     * @see updateTaskStatus
     */
    startInspectionTasks: reactifyRequest(MonkApi.startInspectionTasks, config, dispatch),
  };
}
