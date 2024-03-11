import { useEffect, useState } from 'react';
import { MonkAPIConfig, MonkApiResponse, useMonkApi } from '@monkvision/network';
import { TransactionStatus, useMonitoring } from '@monkvision/monitoring';
import { LoadingState, MonkGotOneInspectionAction, useAsyncEffect } from '@monkvision/common';
import { Image, Sight } from '@monkvision/types';
import { sights } from '@monkvision/sights';
import { MonkPicture } from '@monkvision/camera-web';
import {
  InspectionCompletionMeasurement,
  InternalPhotoCaptureMonitoringConfig,
  SightMeasurement,
  SightsTakenMeasurement,
} from '../monitoring';

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
  /**
   * Inspection monitoring configuration for the sight transaction.
   */
  monitoring?: InternalPhotoCaptureMonitoringConfig;
}

function getSightsTaken(
  inspectionId: string,
  response: MonkApiResponse<MonkGotOneInspectionAction>,
): Sight[] {
  return (
    response.action.payload?.images
      ?.filter(
        (image: Image) => image.inspectionId === inspectionId && image.additionalData?.['sight_id'],
      )
      .map((image: Image) => sights[image.additionalData?.['sight_id'] as string]) ?? []
  );
}

function getLastPictureTaken(
  inspectionId: string,
  response: MonkApiResponse<MonkGotOneInspectionAction>,
): MonkPicture | null {
  const images = response.action.payload?.images?.filter(
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

function startSightMeasurement(
  monitoring: InternalPhotoCaptureMonitoringConfig | undefined,
  sightLabel: string,
): void {
  monitoring?.transaction?.startMeasurement(SightMeasurement.operation, {
    data: monitoring?.data,
    tags: {
      [SightMeasurement.sightLabelTagName]: sightLabel,
      ...(monitoring.tags ?? {}),
    },
    description: SightMeasurement.description,
  });
}

function stopSightMeasurement(
  monitoring: InternalPhotoCaptureMonitoringConfig | undefined,
  status: TransactionStatus,
): void {
  monitoring?.transaction?.stopMeasurement(SightMeasurement.operation, status);
}

function setSightsTakenMeasurement(
  sightsTaken: number,
  captureSights: number,
  monitoring?: InternalPhotoCaptureMonitoringConfig,
): void {
  monitoring?.transaction?.setMeasurement(SightsTakenMeasurement.name, sightsTaken, 'none');
  monitoring?.transaction?.setMeasurement(
    InspectionCompletionMeasurement.name,
    sightsTaken / captureSights,
    'ratio',
  );
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
  monitoring,
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
        const alreadyTakenSights = getSightsTaken(inspectionId, response);
        setSightsTaken(alreadyTakenSights);
        const alreadySelectedSight = captureSights.filter(
          (s) => !alreadyTakenSights.includes(s),
        )[0];
        setSelectedSight(alreadySelectedSight);
        setLastPictureTaken(getLastPictureTaken(inspectionId, response));
        loading.onSuccess();
      },
      onReject: (err) => {
        handleError(err);
        loading.onError(err);
      },
    },
  );

  const handleSelectedSight = (sight: Sight) => {
    if (sight === selectedSight) {
      return;
    }
    stopSightMeasurement(monitoring, TransactionStatus.OK);
    setSelectedSight(sight);
    startSightMeasurement(monitoring, sight.label);
  };

  const retryLoadingInspection = () => {
    setRetryCount((value) => value + 1);
  };

  const takeSelectedSight = () => {
    const updatedSightsTaken = [...sightsTaken, selectedSight];
    setSightsTaken(updatedSightsTaken);
    setSightsTakenMeasurement(updatedSightsTaken.length, captureSights.length, monitoring);
    const nextSight = captureSights.filter((s) => !updatedSightsTaken.includes(s))[0];
    if (nextSight) {
      handleSelectedSight(nextSight);
    } else {
      onLastSightTaken();
    }
  };

  useEffect(() => {
    if (monitoring) {
      startSightMeasurement(monitoring, selectedSight.label);
    }
  }, [monitoring]);

  return {
    selectedSight,
    sightsTaken,
    selectSight: handleSelectedSight,
    takeSelectedSight,
    lastPictureTaken,
    setLastPictureTaken,
    retryLoadingInspection,
  };
}
