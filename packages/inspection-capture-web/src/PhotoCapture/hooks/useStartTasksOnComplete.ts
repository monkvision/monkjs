import { PhotoCaptureAppConfig, Sight, TaskName } from '@monkvision/types';
import { flatMap, LoadingState, uniq } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { useCallback } from 'react';

/**
 * Parameters of the useStartTasksOnComplete hook.
 */
export interface UseStartTasksOnCompleteParams
  extends Pick<PhotoCaptureAppConfig, 'additionalTasks' | 'tasksBySight' | 'startTasksOnComplete'> {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The list of sights passed to the PhotoCapture component.
   */
  sights: Sight[];
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * Global loading state of the PhotoCapture component.
   */
  loading: LoadingState;
}

/**
 * Callback to be called when the PhotoCapture inspection is complete in order to start (or not) to inspection tasks.
 */
export type StartTasksFunction = () => Promise<void>;

const TASKS_NOT_TO_START = [TaskName.HUMAN_IN_THE_LOOP];

function getTasksToStart({
  sights,
  additionalTasks,
  tasksBySight,
  startTasksOnComplete,
}: Pick<
  UseStartTasksOnCompleteParams,
  'sights' | 'additionalTasks' | 'tasksBySight' | 'startTasksOnComplete'
>): TaskName[] {
  let tasks: TaskName[];
  if (Array.isArray(startTasksOnComplete)) {
    tasks = startTasksOnComplete;
  } else {
    tasks = uniq(flatMap(sights, (sight) => tasksBySight?.[sight.id] ?? sight.tasks));
    additionalTasks?.forEach((additionalTask) => {
      if (!tasks.includes(additionalTask)) {
        tasks.push(additionalTask);
      }
    });
  }
  return tasks.filter((task) => !TASKS_NOT_TO_START.includes(task));
}

/**
 * Custom hook used to generate a callback called at the end of the PhotoCapture inspection in order to automatically
 * start (or not) the inspection tasks.
 */
export function useStartTasksOnComplete({
  inspectionId,
  apiConfig,
  sights,
  additionalTasks,
  tasksBySight,
  startTasksOnComplete,
  loading,
}: UseStartTasksOnCompleteParams): StartTasksFunction {
  const { startInspectionTasks } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();

  return useCallback(async () => {
    if (!startTasksOnComplete) {
      return;
    }
    const names = getTasksToStart({ sights, additionalTasks, tasksBySight, startTasksOnComplete });

    loading.start();
    try {
      await startInspectionTasks({ inspectionId, names });
      loading.onSuccess();
    } catch (err) {
      handleError(err);
      loading.onError(err);
    }
  }, [startTasksOnComplete, loading, sights, tasksBySight, inspectionId, handleError]);
}
