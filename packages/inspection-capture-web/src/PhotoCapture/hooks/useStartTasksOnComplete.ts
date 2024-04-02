import { Sight, TaskName } from '@monkvision/types';
import { flatMap, LoadingState, uniq } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { useCallback } from 'react';

/**
 * Parameters of the useStartTasksOnComplete hook.
 */
export interface UseStartTasksOnCompleteParams {
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
  /**
   * Record associating each sight with a list of tasks to execute for it. If not provided, the default tasks of the
   * sight will be used.
   */
  tasksBySight?: Record<string, TaskName[]>;
  /**
   * Value indicating if tasks should be started at the end of the inspection :
   * - If not provided or if value is set to `false`, no tasks will be started.
   * - If set to `true`, the tasks described by the `tasksBySight` param (or, if not provided, the default tasks of each
   * sight) will be started.
   * - If an array of tasks is provided, the tasks started will be the ones contained in the array.
   */
  startTasksOnComplete?: boolean | TaskName[];
}

/**
 * Callback to be called when the PhotoCapture inspection is complete in order to start (or not) to inspection tasks.
 */
export type StartTasksFunction = () => Promise<void>;

function getTasksToStart({
  sights,
  tasksBySight,
  startTasksOnComplete,
}: Pick<
  UseStartTasksOnCompleteParams,
  'sights' | 'tasksBySight' | 'startTasksOnComplete'
>): TaskName[] {
  if (Array.isArray(startTasksOnComplete)) {
    return startTasksOnComplete;
  }
  if (tasksBySight) {
    return uniq(flatMap(sights, (sight) => tasksBySight[sight.id]));
  }
  return uniq(flatMap(sights, (sight) => sight.tasks));
}

/**
 * Custom hook used to generate a callback called at the end of the PhotoCapture inspection in order to automatically
 * start (or not) the inspection tasks.
 */
export function useStartTasksOnComplete({
  inspectionId,
  apiConfig,
  sights,
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
    const names = getTasksToStart({ sights, tasksBySight, startTasksOnComplete });

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
