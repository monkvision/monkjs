import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  GetInspectionResponse,
  MonkApiConfig,
  MonkApiResponse,
  useMonkApi,
} from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import {
  getInspectionImages,
  LoadingState,
  MonkState,
  uniq,
  useAsyncEffect,
  useMonkState,
  useObjectMemo,
  usePreventExit,
} from '@monkvision/common';
import {
  ComplianceOptions,
  Image,
  Sight,
  TaskName,
  ImageStatus,
  ProgressStatus,
} from '@monkvision/types';
import { sights } from '@monkvision/sights';
import { useAnalytics } from '@monkvision/analytics';
import { PhotoCaptureErrorName } from '../errors';
import { StartTasksFunction } from '../../hooks';

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
  lastPictureTakenUri: string | null;
  /**
   * Callback used to manually update the last picture taken by the user after they take a picture.
   */
  setLastPictureTakenUri: (uri: string) => void;
  /**
   * Callback that can be used to retry fetching this state object from the API in case the previous fetch failed.
   */
  retryLoadingInspection: () => void;
  /**
   * Boolean indicating if the inspection is completed or not.
   */
  isInspectionCompleted: boolean;
  /**
   * Callback used to manually update the completion state of the inspection.
   */
  setIsInspectionCompleted: Dispatch<SetStateAction<boolean>>;
  /**
   * Callback called when the inspection capture is complete.
   */
  handleInspectionCompleted: () => void;
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
   * The options for the compliance conf
   */
  complianceOptions: ComplianceOptions;
  /**
   * Callback used to manually update the completion state of the inspection.
   */
  setIsInitialInspectionFetched: (state: boolean) => void;
  /**
   * Record associating each sight with a list of tasks to execute for it. If not provided, the default tasks of the
   * sight will be used.
   */
  tasksBySight?: Record<string, TaskName[]>;
  /**
   * Callback called when the PhotoCapture inspection is complete in order to start (or not) to inspection tasks.
   */
  startTasks: StartTasksFunction;
  /**
   * Callback called when inspection capture is complete.
   */
  onComplete?: () => void;
  /**
   * Boolean indicating whether the inspection should be automatically completed when all sights are compliant.
   */
  enableAutoComplete?: boolean;
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
  return uniq(
    response.entities.images
      ?.filter((image: Image) => image.inspectionId === inspectionId && image.sightId)
      .map((image: Image) => sights[image.sightId as string]) ?? [],
  );
}

function getLastPictureTakenUri(
  inspectionId: string,
  response: MonkApiResponse<GetInspectionResponse>,
): string | null {
  const images = response.entities.images.filter(
    (image: Image) => image.inspectionId === inspectionId,
  );
  return images && images.length > 0 ? images[images.length - 1].path : null;
}

function getNotCompliantSights(inspectionId: string, captureSights: Sight[], entities: MonkState) {
  return captureSights
    .map((s) => ({
      sight: s,
      image: getInspectionImages(inspectionId, entities.images, undefined, true).find(
        (i) => i.inspectionId === inspectionId && i.sightId === s.id,
      ),
    }))
    .filter(
      ({ image }) =>
        !!image && [ImageStatus.NOT_COMPLIANT, ImageStatus.UPLOAD_FAILED].includes(image.status),
    )
    .map(({ sight }) => sight);
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
  setIsInitialInspectionFetched,
  complianceOptions,
  startTasks,
  onComplete,
  enableAutoComplete,
}: PhotoCaptureSightsParams): PhotoCaptureSightState {
  if (captureSights.length === 0) {
    throw new Error('Empty sight list given to the Monk PhotoCapture component.');
  }
  const [retryCount, setRetryCount] = useState(0);
  const [lastPictureTakenUri, setLastPictureTakenUri] = useState<string | null>(null);
  const [selectedSight, setSelectedSight] = useState(captureSights[0]);
  const [isInspectionCompleted, setIsInspectionCompleted] = useState(false);
  const [sightsTaken, setSightsTaken] = useState<Sight[]>([]);
  const { getInspection } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();
  const { state } = useMonkState();
  const analytics = useAnalytics();
  const { allowRedirect } = usePreventExit(sightsTaken.length !== 0);

  const handleInspectionCompleted = useCallback(() => {
    startTasks()
      .then(() => {
        analytics.trackEvent('Capture Completed');
        analytics.setUserProperties({
          captureCompleted: true,
          sightSelected: 'inspection-completed',
        });
        allowRedirect();
        onComplete?.();
        setIsInspectionCompleted(true);
      })
      .catch((err) => {
        loading.onError(err);
        handleError(err);
      });
  }, []);

  const onFetchInspection = (response: MonkApiResponse<GetInspectionResponse>) => {
    try {
      setIsInitialInspectionFetched(true);
      assertInspectionIsValid(inspectionId, response, captureSights, tasksBySight);
      const alreadyTakenSights = getSightsTaken(inspectionId, response);
      setSightsTaken(alreadyTakenSights);
      const notCapturedSights = captureSights.filter((s) => !alreadyTakenSights.includes(s));
      analytics.setUserProperties({
        alreadyTakenSights: alreadyTakenSights.length,
        totalSights: captureSights.length,
        sightSelected: notCapturedSights.length > 0 ? notCapturedSights[0].label : null,
      });
      analytics.setEventsProperties({ totalSights: captureSights.length });
      analytics.trackEvent('Capture Started', {
        newInspection: alreadyTakenSights.length === 0,
        alreadyTakenSights: alreadyTakenSights.length,
        totalSights: captureSights.length,
      });
      if (notCapturedSights.length > 0) {
        setSelectedSight(notCapturedSights[0]);
      } else {
        onLastSightTaken();
        const notCompliantSights = getNotCompliantSights(inspectionId, captureSights, state);
        const sightToRetake =
          notCompliantSights.length > 0
            ? notCompliantSights[0]
            : captureSights[captureSights.length - 1];
        setSightsTaken(alreadyTakenSights.filter((sight) => sight !== sightToRetake));
        setSelectedSight(sightToRetake);
      }
      setLastPictureTakenUri(getLastPictureTakenUri(inspectionId, response));
      loading.onSuccess();
      setIsInspectionCompleted(
        !response.entities.tasks.some(
          (task) =>
            task.inspectionId === inspectionId && task.status === ProgressStatus.NOT_STARTED,
        ),
      );
    } catch (err) {
      handleError(err);
      loading.onError(err);
    }
  };

  useAsyncEffect(
    () => {
      loading.start();
      analytics.setUserProperties({ inspectionId });
      analytics.setEventsProperties({ inspectionId });
      return getInspection({
        id: inspectionId,
        compliance: complianceOptions,
      });
    },
    [inspectionId, retryCount, complianceOptions],
    {
      onResolve: onFetchInspection,
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
    analytics.trackEvent('Sight Captured', {
      order: captureSights.indexOf(selectedSight) + 1,
      alreadyTakenSights: updatedSightsTaken.length,
      totalSights: captureSights.length,
      sightId: selectedSight.id,
      sightLabel: selectedSight.label,
      nextSightId: nextSight?.id ?? null,
      nextSightLabel: nextSight?.label ?? null,
      retake: isRetake,
    });
    analytics.setUserProperties({
      alreadyTakenSights: updatedSightsTaken.length,
      sightSelected: selectedSight.label,
    });
    if (nextSight) {
      setSelectedSight(nextSight);
    } else {
      const notCompliantSights = getNotCompliantSights(inspectionId, captureSights, state);
      console.log(!notCompliantSights.length);
      if (enableAutoComplete && !notCompliantSights.length) {
        handleInspectionCompleted();
      } else {
        onLastSightTaken();
      }
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

  const selectSight = (s: Sight) => {
    const sightsNotTaken = captureSights.filter((sight) => !sightsTaken.includes(sight)) ?? [];
    const nextSight = sightsNotTaken.at(sightsNotTaken.indexOf(s) + 1) ?? null;

    setSelectedSight(s);
    analytics.trackEvent('Sight Selected', {
      sightId: s.id,
      sightLabel: s.label,
      nextSightId: nextSight?.id,
      nextSightLabel: nextSight?.label,
    });
  };

  return useObjectMemo({
    isInspectionCompleted,
    setIsInspectionCompleted,
    selectedSight,
    sightsTaken,
    selectSight,
    takeSelectedSight,
    lastPictureTakenUri,
    setLastPictureTakenUri,
    retryLoadingInspection,
    retakeSight,
    handleInspectionCompleted,
  });
}
