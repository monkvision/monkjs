import { MonkPicture, TaskName } from '@monkvision/types';
import { Queue } from '@monkvision/common';
import { useCallback } from 'react';
import { useAnalytics } from '@monkvision/analytics';
import { PictureUpload } from './useUploadQueue';
import { AddDamageHandle } from './useAddDamageMode';
import { PhotoCaptureSightState, DamageDisclosureState, CaptureMode } from '../types';

/**
 * Parameters of the usePictureTaken hook.
 */
export interface UseTakePictureParams {
  /**
   * The PhotoCapture sight state, created using the usePhotoCaptureSightState hook.
   */
  sightState: PhotoCaptureSightState | DamageDisclosureState;
  /**
   * The PhotoCapture add damage handle, created using the useAddDamageMode hook.
   */
  addDamageHandle: AddDamageHandle;
  /**
   * Photo capture upload queue, created using the useUploadQueue hook.
   */
  uploadQueue: Queue<PictureUpload>;
  /**
   * Record associating each sight to a list of tasks to execute for it. If not provided, the default tasks of the sight
   * will be used.
   */
  tasksBySight?: Record<string, TaskName[]>;
  /**
   * User defined callback that can be called when a picture has been taken in the PhotoCapture process.
   */
  onPictureTaken?: (picture: MonkPicture) => void;
}

/**
 * Callback called when the user has taken a picture.
 */
export type HandleTakePictureFunction = (picture: MonkPicture) => void;

/**
 * Custom hook used to generate the callback called when the user has taken a picture to handle picture upload etc.
 */
export function usePictureTaken({
  sightState,
  addDamageHandle,
  uploadQueue,
  tasksBySight,
  onPictureTaken,
}: UseTakePictureParams): HandleTakePictureFunction {
  const { trackEvent } = useAnalytics();

  const selectedSightId = 'selectedSight' in sightState ? sightState.selectedSight.id : undefined;

  const takeSelectedSight =
    'takeSelectedSight' in sightState ? sightState.takeSelectedSight : undefined;

  return useCallback(
    (picture: MonkPicture) => {
      onPictureTaken?.(picture);
      sightState.setLastPictureTakenUri(picture.uri);
      if (addDamageHandle.mode === CaptureMode.ADD_DAMAGE_PART_SELECT_SHOT) {
        uploadQueue.push({
          mode: addDamageHandle.mode,
          picture,
          vehicleParts: addDamageHandle.vehicleParts,
        });
      }
      if (addDamageHandle.mode === CaptureMode.SIGHT && 'selectedSight' in sightState) {
        uploadQueue.push({
          mode: addDamageHandle.mode,
          picture,
          sightId: sightState.selectedSight.id,
          tasks: tasksBySight?.[sightState.selectedSight.id] ?? sightState.selectedSight.tasks,
        });
      }
      if (
        addDamageHandle.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT ||
        addDamageHandle.mode === CaptureMode.ADD_DAMAGE_2ND_SHOT
      ) {
        uploadQueue.push({ mode: addDamageHandle.mode, picture });
      }
      if (addDamageHandle.mode === CaptureMode.SIGHT && 'takeSelectedSight' in sightState) {
        sightState.takeSelectedSight();
      } else {
        trackEvent('AddDamage Captured', {
          mode: addDamageHandle.mode,
        });
      }
      addDamageHandle.updatePhotoCaptureModeAfterPictureTaken();
    },
    [
      sightState.setLastPictureTakenUri,
      addDamageHandle.mode,
      selectedSightId,
      tasksBySight,
      uploadQueue.push,
      takeSelectedSight,
      addDamageHandle.updatePhotoCaptureModeAfterPictureTaken,
      onPictureTaken,
    ],
  );
}
