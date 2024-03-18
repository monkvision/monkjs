import { MonkPicture } from '@monkvision/camera-web';
import { TaskName } from '@monkvision/types';
import { Queue } from '@monkvision/common';
import { useCallback } from 'react';
import { PictureUpload } from './useUploadQueue';
import { AddDamageHandle, PhotoCaptureMode } from './useAddDamageMode';
import { PhotoCaptureSightState } from './usePhotoCaptureSightState';

/**
 * Parameters of the usePictureTaken hook.
 */
export interface UseTakePictureParams {
  /**
   * The PhotoCapture sight state, created using the usePhotoCaptureSightState hook.
   */
  sightState: PhotoCaptureSightState;
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
}: UseTakePictureParams): HandleTakePictureFunction {
  return useCallback(
    (picture: MonkPicture) => {
      sightState.setLastPictureTaken(picture);
      const upload: PictureUpload =
        addDamageHandle.mode === PhotoCaptureMode.SIGHT
          ? {
              mode: addDamageHandle.mode,
              picture,
              sightId: sightState.selectedSight.id,
              tasks: tasksBySight?.[sightState.selectedSight.id] ?? sightState.selectedSight.tasks,
            }
          : { mode: addDamageHandle.mode, picture };
      uploadQueue.push(upload);
      if (addDamageHandle.mode === PhotoCaptureMode.SIGHT) {
        sightState.takeSelectedSight();
      }
      addDamageHandle.updatePhotoCaptureModeAfterPictureTaken();
    },
    [
      sightState.setLastPictureTaken,
      addDamageHandle.mode,
      sightState.selectedSight.id,
      tasksBySight,
      uploadQueue.push,
      sightState.takeSelectedSight,
      addDamageHandle.updatePhotoCaptureModeAfterPictureTaken,
    ],
  );
}
