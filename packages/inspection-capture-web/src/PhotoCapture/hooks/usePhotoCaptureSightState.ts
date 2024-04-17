import { useCallback, useMemo, useState } from 'react';
import {
  GetInspectionResponse,
  MonkApiConfig,
  MonkApiResponse,
  useMonkApi,
} from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { LoadingState, useAsyncEffect } from '@monkvision/common';
import { ComplianceOptions, Image, Sight, TaskName, MonkPicture } from '@monkvision/types';
import { sights } from '@monkvision/sights';
import { useAnalytics } from '@monkvision/analytics';
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
   * Callback called when a sight needs to be retaken.
   */
  retakeSight: (id: string) => void;
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
export interface PhotoCaptureSightsParams extends Partial<ComplianceOptions> {
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
  apiConfig: MonkApiConfig;
  /**
   * Global loading state of the PhotoCapture component.
   */
  loading: LoadingState;
  /**
   * Callback called when the last sight has been taken by the user.
   */
  onLastSightTaken: () => void;
  /**
   * Record associating each sight with a list of tasks to execute for it. If not provided, the default tasks of the
   * sight will be used.
   */
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
  enableCompliance,
  complianceIssues,
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
  const analytics = useAnalytics();

  const selectSight = (s: Sight) => {
    const sightsNotTaken = captureSights.filter((sight) => !sightsTaken.includes(sight)) ?? [];
    const nextSight = sightsNotTaken.at(sightsNotTaken.indexOf(s) + 1) ?? null;

    setSelectedSight(s);
    analytics.trackEvent(`Sight Selected`, {
      inspectionId,
      sightId: s.id,
      sightLabel: s.label,
      nextSightId: nextSight?.id,
      nextSightLabel: nextSight?.label,
      category: 'sight_selected',
    });
  };

  useAsyncEffect(
    () => {
      loading.start();
      analytics.setUserProperties({ inspectionId, captureCompleted: false });
      analytics.setEventsProperties({ inspectionId });
      return getInspection({
        id: inspectionId,
        compliance: { enableCompliance, complianceIssues },
      });
    },
    [inspectionId, retryCount, enableCompliance, complianceIssues],
    {
      onResolve: (response) => {
        try {
          const alreadyTakenSights = getSightsTaken(inspectionId, response);
          setSightsTaken(alreadyTakenSights);
          const updatedSelectedSight = captureSights.filter(
            (s) => !alreadyTakenSights.includes(s),
          )[0];
          setSelectedSight(updatedSelectedSight);
          analytics.setUserProperties({
            alreadyTakenSights: alreadyTakenSights.length,
            totalSights: captureSights.length,
            sightSelected: updatedSelectedSight.label,
          });
          analytics.setEventsProperties({ totalSights: captureSights.length });
          analytics.trackEvent('Capture Started', {
            newInspection: !!alreadyTakenSights,
            alreadyTakenSights: alreadyTakenSights.length,
            totalSights: captureSights.length,
            category: 'capture_started',
          });
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
    const isRetake = sightsTaken.includes(selectedSight);
    const updatedSightsTaken = isRetake ? sightsTaken : [...sightsTaken, selectedSight];
    setSightsTaken(updatedSightsTaken);
    const nextSight = captureSights.filter((s) => !updatedSightsTaken.includes(s))[0];
    analytics.trackEvent(`Sight Captured`, {
      inspectionId,
      order: captureSights.indexOf(selectedSight) + 1,
      alreadyTakenSights: updatedSightsTaken.length,
      totalSights: captureSights.length,
      sightId: selectedSight.id,
      sightLabel: selectedSight.label,
      nextSightId: nextSight?.id ?? null,
      nextSightLabel: nextSight?.label ?? null,
      retake: isRetake,
      category: 'sight_captured',
    });
    analytics.setUserProperties({
      alreadyTakenSights: updatedSightsTaken.length,
      sightSelected: nextSight?.label ?? null,
    });
    if (nextSight) {
      setSelectedSight(nextSight);
    } else {
      onLastSightTaken();
    }
  }, [sightsTaken, selectedSight, captureSights, onLastSightTaken]);

  const retakeSight = useCallback(
    (id: string) => {
      const sightToRetake = captureSights.find((sight) => sight.id === id);
      if (sightToRetake) {
        setSelectedSight(sightToRetake);
      }
    },
    [captureSights],
  );

  return useMemo(
    () => ({
      selectedSight,
      sightsTaken,
      selectSight,
      takeSelectedSight,
      lastPictureTaken,
      setLastPictureTaken,
      retryLoadingInspection,
      retakeSight,
    }),
    [
      selectedSight,
      sightsTaken,
      setSelectedSight,
      takeSelectedSight,
      lastPictureTaken,
      setLastPictureTaken,
      retryLoadingInspection,
      retakeSight,
    ],
  );
}
