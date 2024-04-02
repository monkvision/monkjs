import { Queue, useQueue } from '@monkvision/common';
import { MonkPicture } from '@monkvision/camera-web';
import { AddImageOptions, MonkApiConfig, useMonkApi } from '@monkvision/network';
import { ImageType, TaskName, ComplianceOptions } from '@monkvision/types';
import { useRef } from 'react';
import { useMonitoring } from '@monkvision/monitoring';
import { PhotoCaptureMode } from './useAddDamageMode';

/**
 * Parameters of the useUploadQueue hook.
 */
export interface UploadQueueParams extends Partial<ComplianceOptions> {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
}

/**
 * Upload options for a normal sight picture.
 */
export interface SightPictureUpload {
  /**
   * Upload mode : `PhotoCaptureMode.SIGHT`.
   */
  mode: PhotoCaptureMode.SIGHT;
  /**
   * The picture to upload.
   */
  picture: MonkPicture;
  /**
   * The ID of the sight of the picture uploaded.
   */
  sightId: string;
  /**
   * The tasks to run for the given sight.
   */
  tasks: TaskName[];
}

/**
 * Upload options for the first picture of a 2-shot add damage process.
 */
export interface AddDamage1stShotPictureUpload {
  /**
   * Upload mode : `PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT`.
   */
  mode: PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT;
  /**
   * The picture to upload.
   */
  picture: MonkPicture;
}

/**
 * Upload options for the second picture of a 2-shot add damage process.
 */
export interface AddDamage2ndShotPictureUpload {
  /**
   * Upload mode : `PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT`.
   */
  mode: PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT;
  /**
   * The picture to upload.
   */
  picture: MonkPicture;
}

/**
 * Union type describing every possible upload configurations for a picture taken.
 */
export type PictureUpload =
  | SightPictureUpload
  | AddDamage1stShotPictureUpload
  | AddDamage2ndShotPictureUpload;

function createAddImageOptions(
  upload: PictureUpload,
  inspectionId: string,
  siblingId: number,
  compliance?: ComplianceOptions,
): AddImageOptions {
  if (upload.mode === PhotoCaptureMode.SIGHT) {
    return {
      type: ImageType.BEAUTY_SHOT,
      picture: upload.picture,
      sightId: upload.sightId,
      tasks: upload.tasks,
      inspectionId,
      compliance,
    };
  }
  return {
    type: ImageType.CLOSE_UP,
    picture: upload.picture,
    siblingKey: `closeup-sibling-key-${siblingId}`,
    firstShot: upload.mode === PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT,
    inspectionId,
    compliance,
  };
}

/**
 * Custom hook used to generate the UploadQueue (using the `useQueue` hook) for the PhotoCapture component.
 */
export function useUploadQueue({
  inspectionId,
  apiConfig,
  enableCompliance,
  complianceIssues,
}: UploadQueueParams): Queue<PictureUpload> {
  const { handleError } = useMonitoring();
  const siblingIdRef = useRef(0);
  const { addImage } = useMonkApi(apiConfig);

  return useQueue<PictureUpload>(
    async (upload: PictureUpload) => {
      if (upload.mode === PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT) {
        siblingIdRef.current += 1;
      }
      try {
        await addImage(
          createAddImageOptions(upload, inspectionId, siblingIdRef.current, {
            enableCompliance,
            complianceIssues,
          }),
        );
      } catch (err) {
        handleError(err);
        throw err;
      }
    },
    {
      maxProcessingItems: 5,
      storeFailedItems: true,
    },
  );
}
