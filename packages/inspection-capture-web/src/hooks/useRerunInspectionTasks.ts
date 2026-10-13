import { PhotoCaptureAppConfig, Sight } from '@monkvision/types';
import { LoadingState } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { useCallback } from 'react';
import { getTasksToStart } from './useStartTasksOnComplete';

/**
 * Parameters of the useRerunInspectionTasks hook.
 */
export interface UseRerunInspectionTasksParams
  extends Pick<PhotoCaptureAppConfig, 'additionalTasks' | 'tasksBySight' | 'startTasksOnComplete'> {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * Global loading state of the PhotoCapture component.
   */
  loading: LoadingState;
  /**
   * The list of sights passed to the PhotoCapture component.
   */
  sights?: Sight[];
  /**
   * Callback used to update the inspection completion state. Called with `false` after tasks are successfully
   * reset so the gallery returns to the Submit state.
   */
  setIsInspectionCompleted: (value: boolean) => void;
}

/**
 * Custom hook that returns a callback that re-queues completed inspection tasks back to the TODO status,
 * allowing them to be processed again by the backend.
 */
export function useRerunInspectionTasks({
  inspectionId,
  apiConfig,
  sights,
  additionalTasks,
  tasksBySight,
  startTasksOnComplete,
  loading,
  setIsInspectionCompleted,
}: UseRerunInspectionTasksParams): () => Promise<void> {
  const { rerunInspectionTasks } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();

  return useCallback(async () => {
    const names = getTasksToStart({ sights, additionalTasks, tasksBySight, startTasksOnComplete });

    try {
      loading.start();
      await rerunInspectionTasks({ inspectionId, names });
      setIsInspectionCompleted(false);
      loading.onSuccess();
    } catch (err) {
      handleError(err);
      loading.onError(err);
    }
  }, [
    startTasksOnComplete,
    loading,
    sights,
    tasksBySight,
    inspectionId,
    handleError,
    setIsInspectionCompleted,
  ]);
}
