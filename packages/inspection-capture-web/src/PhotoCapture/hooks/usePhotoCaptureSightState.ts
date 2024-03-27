import { useCallback, useMemo, useState } from 'react';
import {
  GetInspectionResponse,
  MonkAPIConfig,
  MonkApiResponse,
  useMonkApi,
} from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { LoadingState, useAsyncEffect } from '@monkvision/common';
import { Image, Sight, TaskName } from '@monkvision/types';
import { sights } from '@monkvision/sights';
import { MonkPicture } from '@monkvision/camera-web';
import { PhotoCaptureErrorName } from '../errors';

/**
 * Object containing state management utilities for the PhotoCapture sights.
 */
export interface PhotoCaptureSightState {
  /**
   * The currently selected sight in the PhotoCapture component : the sight that the user needs to capture.
   */
  selectedSight: Sight;
  /**
   * Array containing the list of sights that the user has already captured.
   */
  sightsTaken: Sight[];
  /**
   * Callback called when the user manually select a new sight.
   */
  selectSight: (s: Sight) => void;
  /**
   * Callback called when the user has taken a picture of a sight.
   */
  takeSelectedSight: () => void;
  /**
   * Value storing the last picture taken by the user. If no picture has been taken yet, this value is null.
   */
  lastPictureTaken: MonkPicture | null;
  /**
   * Callback used to manually update the last picture taken by the user after they take a picture.
   */
  setLastPictureTaken: (picture: MonkPicture) => void;
  /**
   * Callback that can be used to retry fetching this state object from the API in case the previous fetch failed.
   */
  retryLoadingInspection: () => void;
}

/**
 * Parameters of the usePhotoCaptureSightState hook.
 */
export interface PhotoCaptureSightsParams {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The list of sights provided to the PhotoCapture component.
   */
  captureSights: Sight[];
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkAPIConfig;
  /**
   * Global loading state of the PhotoCapture component.
   */
  loading: LoadingState;
  /**
   * Callback called when the last sight has been taken by the user.
   */
  onLastSightTaken: () => void;
  tasksBySight?: Record<string, TaskName[]>;
}

function getCaptureTasks(
  captureSights: Sight[],
  tasksBySight?: Record<string, TaskName[]>,
): TaskName[] {
  const tasks: TaskName[] = [];
  captureSights.forEach((sight) => {
    const sightTasks = tasksBySight ? tasksBySight[sight.id] : sight.tasks;
    sightTasks.forEach((task) => {
      if (!tasks.includes(task)) {
        tasks.push(task);
      }
    });
  });
  return tasks;
}

function assertInspectionIsValid(
  inspectionId: string,
  response: MonkApiResponse<GetInspectionResponse>,
  captureSights: Sight[],
  tasksBySight?: Record<string, TaskName[]>,
): void {
  const inspectionTasks = response.entities.tasks
    ?.filter((task) => task.inspectionId === inspectionId)
    ?.map((task) => task.name);
  if (inspectionTasks) {
    const missingTasks: TaskName[] = [];
    getCaptureTasks(captureSights, tasksBySight).forEach((captureTask) => {
      if (!inspectionTasks.includes(captureTask)) {
        missingTasks.push(captureTask);
      }
    });
    if (missingTasks.length > 0) {
      const error = new Error(
        `The provided inspection is missing the following tasks required by the current capture configuration : ${missingTasks}`,
      );
      error.name = PhotoCaptureErrorName.MISSING_TASK_IN_INSPECTION;
      throw error;
    }
  }
}

function getSightsTaken(
  inspectionId: string,
  response: MonkApiResponse<GetInspectionResponse>,
): Sight[] {
  return (
    response.entities.images
      ?.filter(
        (image: Image) => image.inspectionId === inspectionId && image.additionalData?.['sight_id'],
      )
      .map((image: Image) => sights[image.additionalData?.['sight_id'] as string]) ?? []
  );
}

function getLastPictureTaken(
  inspectionId: string,
  response: MonkApiResponse<GetInspectionResponse>,
): MonkPicture | null {
  const images = response.entities.images.filter(
    (image: Image) => image.inspectionId === inspectionId,
  );
  if (images && images.length > 0) {
    return {
      uri: images[images.length - 1].path,
      mimetype: images[images.length - 1].mimetype,
      width: images[images.length - 1].width,
      height: images[images.length - 1].height,
    };
  }
  return null;
}

/**
 * Custom hook used to manage the state of the PhotoCapture sights. This state is automatically fetched from the API at
 * the start of the PhotoCapture process in order to allow users to start the inspection where they left it before.
 */
export function usePhotoCaptureSightState({
  inspectionId,
  captureSights,
  apiConfig,
  loading,
  onLastSightTaken,
  tasksBySight,
}: PhotoCaptureSightsParams): PhotoCaptureSightState {
  if (captureSights.length === 0) {
    throw new Error('Empty sight list given to the Monk PhotoCapture component.');
  }
  const [retryCount, setRetryCount] = useState(0);
  const [lastPictureTaken, setLastPictureTaken] = useState<MonkPicture | null>(null);
  const [selectedSight, setSelectedSight] = useState(captureSights[0]);
  const [sightsTaken, setSightsTaken] = useState<Sight[]>([]);
  const { getInspection } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();

  useAsyncEffect(
    () => {
      loading.start();
      return getInspection(inspectionId);
    },
    [inspectionId, retryCount],
    {
      onResolve: (response) => {
        try {
          const alreadyTakenSights = getSightsTaken(inspectionId, response);
          setSightsTaken(alreadyTakenSights);
          setSelectedSight(captureSights.filter((s) => !alreadyTakenSights.includes(s))[0]);
          setLastPictureTaken(getLastPictureTaken(inspectionId, response));
          assertInspectionIsValid(inspectionId, response, captureSights, tasksBySight);
          loading.onSuccess();
        } catch (err) {
          handleError(err);
          loading.onError(err);
        }
      },
      onReject: (err) => {
        handleError(err);
        loading.onError(err);
      },
    },
  );

  const retryLoadingInspection = useCallback(() => {
    setRetryCount((value) => value + 1);
  }, []);

  const takeSelectedSight = useCallback(() => {
    const updatedSightsTaken = [...sightsTaken, selectedSight];
    setSightsTaken(updatedSightsTaken);
    const nextSight = captureSights.filter((s) => !updatedSightsTaken.includes(s))[0];
    if (nextSight) {
      setSelectedSight(nextSight);
    } else {
      onLastSightTaken();
    }
  }, [sightsTaken, selectedSight, captureSights, onLastSightTaken]);

  return useMemo(
    () => ({
      selectedSight,
      sightsTaken,
      selectSight: setSelectedSight,
      takeSelectedSight,
      lastPictureTaken,
      setLastPictureTaken,
      retryLoadingInspection,
    }),
    [
      selectedSight,
      sightsTaken,
      setSelectedSight,
      takeSelectedSight,
      lastPictureTaken,
      setLastPictureTaken,
      retryLoadingInspection,
    ],
  );
}
