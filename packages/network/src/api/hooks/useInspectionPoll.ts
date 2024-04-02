import { MonkState, useAsyncInterval } from '@monkvision/common';
import { ComplianceOptions } from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { MonkApiConfig } from '../config';
import { useMonkApi } from '../react';

/**
 * Parameters passed to the `useInspectionPoll` hook.
 */
export interface UseInspectionPollParams {
  /**
   * The ID of the inspection to fetch.
   */
  id: string;
  /**
   * The delay in milliseconds between each inspection fetch. Note that if the previous API call is still running, a new
   * one won't be made. Set this value to `null` to stop the API calls.
   */
  delay: number | null;
  /**
   * The API config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * Callback called when the fetch inspection is successful.
   */
  onSuccess?: (state: MonkState) => void;
  /**
   * Additional options used to configure the compliance locally.
   */
  compliance?: ComplianceOptions;
}

/**
 * Custom hook used to fetch an inspection every `delay` milliseconds using the `getInspection` API request. To stop the
 * hook from making requests, simply pass a `null` vlaue for the `delay` param.
 */
export function useInspectionPoll({
  id,
  delay,
  apiConfig,
  onSuccess,
  compliance,
}: UseInspectionPollParams): void {
  const { getInspection } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();

  useAsyncInterval(() => getInspection({ id, compliance }), delay, {
    onResolve: (res) => onSuccess?.(res.entities),
    onReject: handleError,
  });
}
