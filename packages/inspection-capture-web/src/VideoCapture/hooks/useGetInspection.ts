import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { LoadingState, useAsyncEffect } from '@monkvision/common';

/**
 * Params accepted by the useGetInspection hook.
 */
export interface UseGetInspectionParams {
  /**
   * The ID of the inspection to fetch.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * Global loading state of the VideoCapture component.
   */
  loading: LoadingState;
}

/**
 * Custom hook that fetches the inspection details when the VideoCapture component mounts.
 * This ensures the inspection data is available in the Monk state for the video capture process.
 */
export function useGetInspection({ inspectionId, apiConfig, loading }: UseGetInspectionParams) {
  const { getInspection } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();

  useAsyncEffect(
    () => {
      loading.start();
      return getInspection({ id: inspectionId });
    },
    [inspectionId],
    {
      onResolve: () => {
        loading.onSuccess();
      },
      onReject: (err) => {
        handleError(err);
        loading.onError(err);
      },
    },
  );
}
