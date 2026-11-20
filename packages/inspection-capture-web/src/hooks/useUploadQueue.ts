import {
  isInternalServerError,
  isTimeoutError,
  NetworkStatusHandle,
  Queue,
  useMonkState,
  useQueue,
} from '@monkvision/common';
import {
  PhotoCaptureAppConfig,
  ComplianceOptions,
  Image,
  MonkPicture,
  TaskName,
  VehiclePart,
} from '@monkvision/types';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useCallback, useRef } from 'react';
import { useMonitoring } from '@monkvision/monitoring';
import { CaptureMode } from '../types';
import { createAddImageOptions } from './createAddImageOptions';
import { DeferredRetryMetadata, useUploadRetryQueue } from './useUploadRetryQueue';

const MAX_RETRY_COUNT = 1;

let localImageIdCounter = 0;

/**
 * Bookkeeping kept for each upload.
 */
interface UploadMetadata extends DeferredRetryMetadata {
  /**
   * Sibling key index of the 2-shot add damage process, computed at the first attempt and kept across retries.
   */
  siblingId: number;
  /**
   * ID of the local image in the state, kept across retries so that the failed image is replaced, not duplicated.
   */
  localImageId: string;
  /**
   * Retake count of the upload, computed at the first attempt and kept across retries (the failed local image of this
   * upload is in the state on retry and would otherwise inflate it).
   */
  retakeCount?: number;
  /**
   * Number of immediate retries already made.
   */
  count: number;
  /**
   * Whether the last failure was a retryable error.
   */
  retryable: boolean;
}

function createLocalImageId(): string {
  localImageIdCounter += 1;
  return `local-image-${Date.now()}-${localImageIdCounter}`;
}

/**
 * Defines which upload failures should be retried. This is the upload queue's retry policy: a timeout or a 5xx server
 * error is considered transient and worth retrying, anything else (e.g. 4xx, validation errors) is not.
 */
function isRetryableError(err: unknown): boolean {
  return isTimeoutError(err) || isInternalServerError(err);
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
  /**
   * Set to `true` if a new picture of the same sight has been taken while this one was being uploaded (during a
   * deferred retry for instance). In that case, the uploaded image is outdated and should be discarded.
   */
  isOutdated?: true;
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
  /**
   * The network status handle (created using the `useNetworkStatus` hook). If provided, every upload is reported to it
   * in order to evaluate the network quality, and failed uploads are automatically retried when the connection becomes
   * good again (if `enableAutoRetry` is set to `true`).
   */
  networkStatus?: NetworkStatusHandle;
  /**
   * Boolean indicating if uploads that failed because of a bad connection should be automatically retried once the
   * network quality (given by `networkStatus`) is good again.
   *
   * @default false
   */
  enableAutoRetry?: boolean;
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

/**
 * The upload queue returned by the `useUploadQueue` hook. On top of the regular queue features, it keeps track of the
 * uploads that failed because of a network or server issue, so that they can be retried later on without having to
 * take the pictures again.
 */
export interface UploadQueue extends Queue<PictureUpload> {
  /**
   * The uploads that failed because of a network or server issue and that are waiting to be retried.
   */
  failedUploads: PictureUpload[];
  /**
   * The number of failed uploads currently being retried.
   */
  retryingCount: number;
  /**
   * Callback used to retry every failed upload (`failedUploads`). Uploads are retried at most 2 at a time. If one of
   * them fails again, the remaining ones are put back in the `failedUploads` array.
   */
  retryFailed: () => void;
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
  networkStatus,
  enableAutoRetry = false,
}: UploadQueueParams): UploadQueue {
  const { handleError } = useMonitoring();
  const siblingIdRef = useRef(0);
  const { addImage } = useMonkApi(apiConfig);
  const { state } = useMonkState();
  const metadataRef = useRef(new Map<PictureUpload, UploadMetadata>());
  const queueRef = useRef<Queue<PictureUpload> | null>(null);
  const {
    failedUploads,
    retryingCount,
    retryFailed,
    addFailedUpload,
    onDeferredRetryEnd,
    discardOutdated,
  } = useUploadRetryQueue({ metadataRef, queueRef, networkStatus, enableAutoRetry });

  const wheelAnalysisCloseUp = state.tasks.find(
    (task) => task.name === TaskName.WHEEL_ANALYSIS && task.wheelAnalysisCloseUp,
  )?.wheelAnalysisCloseUp;

  const getRetakeCount = (upload: PictureUpload): number | undefined => {
    if (upload.mode !== CaptureMode.SIGHT) {
      return undefined;
    }
    const latestSightImage = state.images
      .filter((img) => img.sightId === upload.sightId && img.inspectionId === inspectionId)
      .reduce<Image | undefined>(
        (latest, img) => (!latest || (img.createdAt ?? 0) > (latest.createdAt ?? 0) ? img : latest),
        undefined,
      );
    return latestSightImage ? (latestSightImage.additionalData?.retake_count ?? 0) + 1 : 0;
  };

  const getMetadata = (upload: PictureUpload): UploadMetadata => {
    let metadata = metadataRef.current.get(upload);
    if (!metadata) {
      if (upload.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT) {
        siblingIdRef.current += 1;
      }
      metadata = {
        siblingId: siblingIdRef.current,
        localImageId: createLocalImageId(),
        retakeCount: getRetakeCount(upload),
        count: 0,
        retryable: false,
        isDeferredRetry: false,
        isOutdated: false,
      };
      metadataRef.current.set(upload, metadata);
    }
    return metadata;
  };

  const queue = useQueue<PictureUpload>(
    async (upload: PictureUpload) => {
      const metadata = getMetadata(upload);
      if (metadata.isOutdated) {
        return;
      }
      const startTs = Date.now();
      try {
        const result = await addImage({
          ...createAddImageOptions(
            upload,
            inspectionId,
            metadata.siblingId,
            true,
            metadata.retakeCount,
            additionalTasks,
            complianceOptions,
            wheelAnalysisCloseUp,
          ),
          localImageId: metadata.localImageId,
        });
        const uploadDurationMs = Date.now() - startTs;
        networkStatus?.reportSample({
          bytes: upload.picture.blob?.size,
          durationMs: uploadDurationMs,
        });
        const sightId = upload.mode === CaptureMode.SIGHT ? upload.sightId : undefined;
        eventHandlers?.forEach((handlers) =>
          handlers.onUploadSuccess?.({
            durationMs: uploadDurationMs,
            sightId,
            imageId: result?.image?.id,
            ...(metadata.isOutdated ? { isOutdated: true as const } : {}),
          }),
        );
      } catch (err) {
        const retryable = isRetryableError(err);
        const willRetry =
          retryable && !metadata.isDeferredRetry && metadata.count < MAX_RETRY_COUNT;
        metadata.retryable = retryable;

        if (isTimeoutError(err)) {
          networkStatus?.reportSample({ failed: true });
        }
        // Errors of deferred retries have already been reported during the first upload attempt.
        if (!willRetry && !(metadata.isDeferredRetry && retryable)) {
          if (isTimeoutError(err)) {
            eventHandlers?.forEach((handlers) => handlers.onUploadTimeout?.());
          }
          handleError(err);
        }
        throw err;
      }
    },
    {
      onItemComplete: (upload: PictureUpload) => {
        if (metadataRef.current.get(upload)?.isDeferredRetry) {
          onDeferredRetryEnd(upload, false);
        } else {
          metadataRef.current.delete(upload);
        }
      },
      onItemFail: (upload: PictureUpload) => {
        const metadata = metadataRef.current.get(upload);
        if (metadata?.isDeferredRetry) {
          if (metadata.retryable) {
            onDeferredRetryEnd(upload, true);
          } else {
            metadataRef.current.delete(upload);
            onDeferredRetryEnd(upload, false);
          }
        } else if (metadata?.isOutdated) {
          metadataRef.current.delete(upload);
        } else if (metadata?.retryable && metadata.count < MAX_RETRY_COUNT) {
          metadata.count += 1;
          metadata.retryable = false;
          queue.push(upload);
        } else if (metadata?.retryable) {
          addFailedUpload(upload);
        } else {
          metadataRef.current.delete(upload);
        }
      },
    },
  );
  queueRef.current = queue;

  const push = useCallback(
    (upload: PictureUpload) => {
      if (upload.mode === CaptureMode.SIGHT) {
        // A new picture of a sight replaces the previous uploads of this sight (failed, waiting to be retried or being
        // retried), which should not be retried anymore.
        const isOutdated = (u: PictureUpload) =>
          u.mode === CaptureMode.SIGHT && u.sightId === upload.sightId;
        metadataRef.current.forEach((metadata, u) => {
          if (isOutdated(u)) {
            // eslint-disable-next-line no-param-reassign
            metadata.isOutdated = true;
          }
        });
        discardOutdated(isOutdated);
      }
      queue.push(upload);
    },
    [queue.push, discardOutdated],
  );

  return {
    ...queue,
    push,
    failedUploads,
    retryingCount,
    retryFailed,
  };
}
