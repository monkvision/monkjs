import { Dispatch, useCallback } from 'react';
import { MonkAction, useMonkState } from '@monkvision/common';
import { MonkApiConfig } from './config';
import { MonkApi } from './api';

type MonkApiRequest<P extends Array<unknown>, A extends MonkAction, R> = (
  ...params: [...P, MonkApiConfig, Dispatch<A>?]
) => R;

function reactify<P extends Array<unknown>, A extends MonkAction, R>(
  request: MonkApiRequest<P, A, R>,
  config: MonkApiConfig,
  dispatch: Dispatch<MonkAction>,
): (...params: P) => R {
  return useCallback((...params: P) => request(...params, config, dispatch), []);
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
export function useMonkApi(config: MonkApiConfig) {
  const { dispatch } = useMonkState();

  return {
    /**
     * Fetch the details of an inspection using its ID.
     *
     * @param options The options of the request.
     */
    getInspection: reactify(MonkApi.getInspection, config, dispatch),
    /**
     * Create a new inspection with the given options. See the `CreateInspectionOptions` interface for more details.
     *
     * @param options The options of the inspection.
     * @see CreateInspectionOptions
     */
    createInspection: reactify(MonkApi.createInspection, config, dispatch),
    /**
     * Add a new image to an inspection.
     *
     * @param options Upload options for the image.
     */
    addImage: reactify(MonkApi.addImage, config, dispatch),
    /**
     * Update the progress status of an inspection task.
     *
     * **Note : This API call is known to sometimes fail for unknown reasons. In order to fix this, we added a retry config
     * to this API request : when failing, this request will retry itself up to 4 times (5 API calls in total), with
     * exponentially increasing delay between each request (max delay : 1.5s).**
     *
     * @param options The options of the request.
     */
    updateTaskStatus: reactify(MonkApi.updateTaskStatus, config, dispatch),
    /**
     * Start some inspection tasks that were in the NOT_STARTED status. This function actually makes one API call for each
     * task provided using the `updateTaskStatus`.
     *
     * **Note : This API call is known to sometimes fail for unknown reasons. Please take note of the details provided in
     * the TSDoc of the `updateTaskStatus` function.**
     *
     * @param options The options of the request.
     *
     * @see updateTaskStatus
     */
    startInspectionTasks: reactify(MonkApi.startInspectionTasks, config, dispatch),
  };
}
