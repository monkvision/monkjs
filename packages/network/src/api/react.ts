import { Dispatch, useCallback } from 'react';
import { MonkAction, useMonkState } from '@monkvision/common';
import { LogContext, useMonitoring } from '@monkvision/monitoring';
import { MonkApiConfig } from './config';
import { MonkApi } from './api';
import { MonkHTTPError } from './error';

type MonkApiRequest<P extends Array<unknown>, A extends MonkAction, R extends Promise<unknown>> = (
  ...params: [...P, MonkApiConfig, Dispatch<A>?]
) => R;

function handleAPIError(
  err: unknown,
  handleError: (err: unknown, context?: Omit<LogContext, 'level'>) => void,
): void {
  const { body } = err as MonkHTTPError;
  handleError(err, {
    extras: {
      body,
      completeResponse: JSON.stringify(body),
    },
  });
  throw err;
}

function reactify<P extends Array<unknown>, A extends MonkAction, R extends Promise<unknown>>(
  request: MonkApiRequest<P, A, R>,
  config: MonkApiConfig,
  dispatch: Dispatch<MonkAction>,
  handleError: (err: unknown, context?: Omit<LogContext, 'level'>) => void,
): (...params: P) => R {
  return useCallback(
    (...params: P) =>
      request(...params, config, dispatch).catch((err) => handleAPIError(err, handleError)) as R,
    [],
  );
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
  const { handleError } = useMonitoring();

  return {
    /**
     * Fetch the details of an inspection using its ID.
     *
     * @param options The options of the request.
     */
    getInspection: reactify(MonkApi.getInspection, config, dispatch, handleError),
    /**
     * Create a new inspection with the given options. See the `CreateInspectionOptions` interface for more details.
     *
     * @param options The options of the inspection.
     * @see CreateInspectionOptions
     */
    createInspection: reactify(MonkApi.createInspection, config, dispatch, handleError),
    /**
     * Add a new image to an inspection.
     *
     * @param options Upload options for the image.
     */
    addImage: reactify(MonkApi.addImage, config, dispatch, handleError),
    /**
     * Update the progress status of an inspection task.
     *
     * **Note : This API call is known to sometimes fail for unknown reasons. In order to fix this, we added a retry config
     * to this API request : when failing, this request will retry itself up to 4 times (5 API calls in total), with
     * exponentially increasing delay between each request (max delay : 1.5s).**
     *
     * @param options The options of the request.
     */
    updateTaskStatus: reactify(MonkApi.updateTaskStatus, config, dispatch, handleError),
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
    startInspectionTasks: reactify(MonkApi.startInspectionTasks, config, dispatch, handleError),
    /**
     * Fetch a webapp live configuration from the API.
     *
     * @param id The ID of the live config to get.
     */
    getLiveConfig: useCallback(
      (id: string) => MonkApi.getLiveConfig(id).catch((err) => handleAPIError(err, handleError)),
      [handleError],
    ),
    /**
     * Update the vehicle of an inspection.
     *
     * @param options The options of the request.
     */
    updateInspectionVehicule: reactify(
      MonkApi.updateInspectionVehicule,
      config,
      dispatch,
      handleError,
    ),
  };
}
