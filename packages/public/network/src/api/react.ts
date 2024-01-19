import {
  useMonkState,
  MonkAction,
  MonkActionType,
  MonkUpdateStateAction,
} from '@monkvision/common';
import { Dispatch } from 'react';
import { MonkAPIConfig } from './config';
import { MonkAPIRequest, MonkAPIResponse } from './requests/types';
import { MonkApi } from './requests';

function reactifyRequest<T extends unknown[], K>(
  request: MonkAPIRequest<T, K>,
  config: MonkAPIConfig,
  dispatch: Dispatch<MonkAction>,
): (...args: T) => Promise<MonkAPIResponse<K>> {
  return async (...args: T) => {
    const result = await request(...args, config);
    const action: MonkUpdateStateAction = {
      type: MonkActionType.UPDATE_STATE,
      payload: result.payload,
    };
    dispatch(action);
    return result;
  };
}

/**
 * Custom hook that returns a MonkApi object in which all the requests don't need a config param (since it is provided)
 * as a prop to this hook, and automatically update the state (using the MonkState hook) when a state has been received.
 *
 * **Note: This hook needs to have the MonkContext set up and defined in order to work properly.**
 *
 * @see MonkApi
 */
export function useMonkApi(config: MonkAPIConfig) {
  const { dispatch } = useMonkState();

  return {
    getInspection: reactifyRequest(MonkApi.getInspection, config, dispatch),
  };
}
