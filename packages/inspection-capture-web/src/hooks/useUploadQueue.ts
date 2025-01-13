import { Queue, uniq, useQueue } from '@monkvision/common';
import { AddImageOptions, ImageUploadType, MonkApiConfig, useMonkApi } from '@monkvision/network';
import {
  PhotoCaptureAppConfig,
  ComplianceOptions,
  MonkPicture,
  TaskName,
  VehiclePart,
} from '@monkvision/types';
import { useRef } from 'react';
import { useMonitoring } from '@monkvision/monitoring';
import { CaptureMode } from '../types';

/**
 * Type definition for upload event handlers.
 */
export interface UploadEventHandlers {
  /**
   * Callback called when a picture upload successfully completes.
   *
   * @param durationMs The total elapsed time in milliseconds between the start of the upload and the end of the upload.
   */
  onUploadSuccess?: (durationMs: number) => void;
  /**
   * Callback called when a picture upload fails because of a timeout.
   */
  onUploadTimeout?: () => void;
}

/**
 * Parameters of the useUploadQueue hook.
 */
export interface UploadQueueParams extends Pick<PhotoCaptureAppConfig, 'additionalTasks'> {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * The options for the compliance conf
   */
  complianceOptions: ComplianceOptions;
  /**
   * A collection of event handlers listening to upload events.
   */
  eventHandlers?: UploadEventHandlers[];
}

/**
 * Upload options for a normal sight picture.
 */
export interface SightPictureUpload {
  /**
   * Upload mode : `PhotoCaptureMode.SIGHT`.
   */
  mode: CaptureMode.SIGHT;
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
  mode: CaptureMode.ADD_DAMAGE_1ST_SHOT;
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
  mode: CaptureMode.ADD_DAMAGE_2ND_SHOT;
  /**
   * The picture to upload.
   */
  picture: MonkPicture;
}

/**
 * Upload options for a part select picture in the add damage process.
 */
export interface AddDamagePartSelectShotPictureUpload {
  /**
   * Upload mode : `PhotoCaptureMode.ADD_DAMAGE_PART_SELECTION`.
   */
  mode: CaptureMode.ADD_DAMAGE_PART_SELECT_SHOT;
  /**
   * The picture to upload.
   */
  picture: MonkPicture;
  /**
   * Selected damaged parts.
   */
  vehicleParts: VehiclePart[];
}

/**
 * Union type describing every possible upload configurations for a picture taken.
 */
export type PictureUpload =
  | SightPictureUpload
  | AddDamage1stShotPictureUpload
  | AddDamage2ndShotPictureUpload
  | AddDamagePartSelectShotPictureUpload;

function createAddImageOptions(
  upload: PictureUpload,
  inspectionId: string,
  siblingId: number,
  enableThumbnail: boolean,
  additionalTasks?: PhotoCaptureAppConfig['additionalTasks'],
  compliance?: ComplianceOptions,
): AddImageOptions {
  if (upload.mode === CaptureMode.SIGHT) {
    return {
      uploadType: ImageUploadType.BEAUTY_SHOT,
      picture: upload.picture,
      sightId: upload.sightId,
      tasks: additionalTasks ? uniq([...upload.tasks, ...additionalTasks]) : upload.tasks,
      inspectionId,
      compliance,
      useThumbnailCaching: enableThumbnail,
    };
  }
  if (upload.mode === CaptureMode.ADD_DAMAGE_PART_SELECT_SHOT) {
    return {
      uploadType: ImageUploadType.PART_SELECT_SHOT,
      picture: upload.picture,
      inspectionId,
      vehicleParts: upload.vehicleParts,
      compliance,
      useThumbnailCaching: enableThumbnail,
    };
  }
  return {
    uploadType: ImageUploadType.CLOSE_UP_2_SHOT,
    picture: upload.picture,
    siblingKey: `closeup-sibling-key-${siblingId}`,
    firstShot: upload.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT,
    inspectionId,
    compliance,
    useThumbnailCaching: enableThumbnail,
  };
}

/**
 * Custom hook used to generate the UploadQueue (using the `useQueue` hook) for the PhotoCapture component.
 */
export function useUploadQueue({
  inspectionId,
  apiConfig,
  additionalTasks,
  complianceOptions,
  eventHandlers,
}: UploadQueueParams): Queue<PictureUpload> {
  const { handleError } = useMonitoring();
  const siblingIdRef = useRef(0);
  const { addImage } = useMonkApi(apiConfig);

  return useQueue<PictureUpload>(async (upload: PictureUpload) => {
    if (upload.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT) {
      siblingIdRef.current += 1;
    }
    try {
      const startTs = Date.now();
      await addImage(
        createAddImageOptions(
          upload,
          inspectionId,
          siblingIdRef.current,
          true,
          additionalTasks,
          complianceOptions,
        ),
      );
      const uploadDurationMs = Date.now() - startTs;
      eventHandlers?.forEach((handlers) => handlers.onUploadSuccess?.(uploadDurationMs));
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === 'TimeoutError' || err.message === 'Failed to fetch')
      ) {
        eventHandlers?.forEach((handlers) => handlers.onUploadTimeout?.());
      }
      handleError(err);
      throw err;
    }
  });
}
