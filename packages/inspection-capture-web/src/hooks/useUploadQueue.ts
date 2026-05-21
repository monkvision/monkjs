import { Queue, uniq, useMonkState, useQueue } from '@monkvision/common';
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

const MAX_RETRY_COUNT = 1;

/**
 * Checks if an error is retryable (timeout or 5xx server error).
 */
export function isRetryableError(err: unknown): boolean {
  if (err instanceof Error) {
    if (err.name === 'TimeoutError' || err.message === 'Failed to fetch') {
      return true;
    }
  }
  if (err && typeof err === 'object' && 'response' in err) {
    const { response } = err as { response?: { status?: number } };
    if (response && typeof response.status === 'number' && response.status >= 500) {
      return true;
    }
  }
  return false;
}

/**
 * Payload for the onUploadSuccess event handler.
 */
export interface UploadSuccessPayload {
  /**
   * The total elapsed time in milliseconds between the start of the upload and the end of the upload.
   */
  durationMs?: number;
  /**
   * The sight ID associated with the uploaded picture, if applicable.
   */
  sightId?: string;
  /**
   * The ID of the uploaded image.
   */
  imageId?: string;
}

/**
 * Type definition for upload event handlers.
 */
export interface UploadEventHandlers {
  /**
   * Callback called when a picture upload successfully completes.
   */
  onUploadSuccess?: (payload: UploadSuccessPayload) => void;
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
  wheelAnalysisCloseUp?: boolean,
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
      wheelAnalysisCloseUp,
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
  const { state } = useMonkState();
  const retryMapRef = useRef(new Map<PictureUpload, { count: number; retryable: boolean }>());

  const wheelAnalysisCloseUp = state.tasks.find(
    (task) => task.name === TaskName.WHEEL_ANALYSIS && task.wheelAnalysisCloseUp,
  )?.wheelAnalysisCloseUp;

  const queue = useQueue<PictureUpload>(
    async (upload: PictureUpload) => {
      if (upload.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT) {
        siblingIdRef.current += 1;
      }
      try {
        const startTs = Date.now();
        const result = await addImage(
          createAddImageOptions(
            upload,
            inspectionId,
            siblingIdRef.current,
            true,
            additionalTasks,
            complianceOptions,
            wheelAnalysisCloseUp,
          ),
        );
        const uploadDurationMs = Date.now() - startTs;
        const sightId = upload.mode === CaptureMode.SIGHT ? upload.sightId : undefined;
        eventHandlers?.forEach((handlers) =>
          handlers.onUploadSuccess?.({
            durationMs: uploadDurationMs,
            sightId,
            imageId: result?.image?.id,
          }),
        );
        retryMapRef.current.delete(upload);
      } catch (err) {
        const retryData = retryMapRef.current.get(upload) ?? { count: 0, retryable: false };
        const retryable = isRetryableError(err);
        const willRetry = retryable && retryData.count < MAX_RETRY_COUNT;

        retryMapRef.current.set(upload, { ...retryData, retryable });

        if (!willRetry) {
          if (
            err instanceof Error &&
            (err.name === 'TimeoutError' || err.message === 'Failed to fetch')
          ) {
            eventHandlers?.forEach((handlers) => handlers.onUploadTimeout?.());
          }
          handleError(err);
        }
        throw err;
      }
    },
    {
      onItemFail: (upload: PictureUpload) => {
        const retryData = retryMapRef.current.get(upload);
        if (retryData?.retryable && retryData.count < MAX_RETRY_COUNT) {
          retryMapRef.current.set(upload, { count: retryData.count + 1, retryable: false });
          queue.push(upload);
        } else {
          retryMapRef.current.delete(upload);
        }
      },
    },
  );

  return queue;
}
