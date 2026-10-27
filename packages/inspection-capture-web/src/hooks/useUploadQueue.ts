import {
  isInternalServerError,
  isTimeoutError,
  NetworkQuality,
  NetworkStatusHandle,
  Queue,
  uniq,
  useMonkState,
  useQueue,
} from '@monkvision/common';
import { AddImageOptions, ImageUploadType, MonkApiConfig, useMonkApi } from '@monkvision/network';
import {
  PhotoCaptureAppConfig,
  ComplianceOptions,
  MonkPicture,
  TaskName,
  VehiclePart,
} from '@monkvision/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMonitoring } from '@monkvision/monitoring';
import { CaptureMode } from '../types';

const MAX_RETRY_COUNT = 1;
const MAX_CONCURRENT_DEFERRED_RETRIES = 2;
const MIN_DEFERRED_RETRY_DELAY_MS = 5000;
const MAX_DEFERRED_RETRY_DELAY_MS = 2 * 60 * 1000;

/**
 * Bookkeeping kept for each upload :
 * - `siblingId` and `localImageId` are computed once, at the first upload attempt, so that retries keep the same 2-shot
 * sibling key and replace the failed local image in the state instead of duplicating it.
 * - `count` is the number of times it has already been retried immediately and `retryable` indicates whether its last
 * failure was a retryable error.
 * - `isDeferredRetry` indicates if the current upload attempt is a deferred retry (see `UploadQueue.retryFailed`).
 */
interface UploadMetadata {
  siblingId: number;
  localImageId: string;
  count: number;
  retryable: boolean;
  isDeferredRetry: boolean;
}

let localImageIdCounter = 0;

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
  networkStatus,
  enableAutoRetry = false,
}: UploadQueueParams): UploadQueue {
  const { handleError } = useMonitoring();
  const siblingIdRef = useRef(0);
  const { addImage } = useMonkApi(apiConfig);
  const { state } = useMonkState();
  const metadataRef = useRef(new Map<PictureUpload, UploadMetadata>());
  const [failedUploads, setFailedUploads] = useState<PictureUpload[]>([]);
  const [retryingCount, setRetryingCount] = useState(0);
  const failedUploadsRef = useRef(failedUploads);
  failedUploadsRef.current = failedUploads;
  const retryBacklogRef = useRef<PictureUpload[]>([]);
  const inFlightRetriesRef = useRef(0);
  const deferredRetryDelayRef = useRef(0);
  const queueRef = useRef<Queue<PictureUpload> | null>(null);

  const wheelAnalysisCloseUp = state.tasks.find(
    (task) => task.name === TaskName.WHEEL_ANALYSIS && task.wheelAnalysisCloseUp,
  )?.wheelAnalysisCloseUp;

  const getMetadata = (upload: PictureUpload): UploadMetadata => {
    let metadata = metadataRef.current.get(upload);
    if (!metadata) {
      if (upload.mode === CaptureMode.ADD_DAMAGE_1ST_SHOT) {
        siblingIdRef.current += 1;
      }
      metadata = {
        siblingId: siblingIdRef.current,
        localImageId: createLocalImageId(),
        count: 0,
        retryable: false,
        isDeferredRetry: false,
      };
      metadataRef.current.set(upload, metadata);
    }
    return metadata;
  };

  const pumpDeferredRetries = () => {
    while (
      inFlightRetriesRef.current < MAX_CONCURRENT_DEFERRED_RETRIES &&
      retryBacklogRef.current.length > 0
    ) {
      const upload = retryBacklogRef.current.shift() as PictureUpload;
      inFlightRetriesRef.current += 1;
      queueRef.current?.push(upload);
    }
    setRetryingCount(inFlightRetriesRef.current + retryBacklogRef.current.length);
  };

  const onDeferredRetryEnd = (upload: PictureUpload, failed: boolean) => {
    inFlightRetriesRef.current = Math.max(0, inFlightRetriesRef.current - 1);
    if (failed) {
      const uploadsToPutBack = [upload, ...retryBacklogRef.current];
      retryBacklogRef.current = [];
      uploadsToPutBack.forEach((u) => {
        const metadata = metadataRef.current.get(u);
        if (metadata) {
          metadata.isDeferredRetry = false;
        }
      });
      setFailedUploads((current) => [...current, ...uploadsToPutBack]);
      deferredRetryDelayRef.current = Math.min(
        Math.max(MIN_DEFERRED_RETRY_DELAY_MS, deferredRetryDelayRef.current * 2),
        MAX_DEFERRED_RETRY_DELAY_MS,
      );
    } else {
      metadataRef.current.delete(upload);
      deferredRetryDelayRef.current = 0;
    }
    pumpDeferredRetries();
  };

  const queue = useQueue<PictureUpload>(
    async (upload: PictureUpload) => {
      const metadata = getMetadata(upload);
      const startTs = Date.now();
      try {
        const result = await addImage({
          ...createAddImageOptions(
            upload,
            inspectionId,
            metadata.siblingId,
            true,
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
        } else if (metadata?.retryable && metadata.count < MAX_RETRY_COUNT) {
          metadata.count += 1;
          metadata.retryable = false;
          queue.push(upload);
        } else if (metadata?.retryable) {
          setFailedUploads((current) => [...current, upload]);
        } else {
          metadataRef.current.delete(upload);
        }
      },
    },
  );
  queueRef.current = queue;

  const retryFailed = useCallback(() => {
    const uploadsToRetry = failedUploadsRef.current;
    if (uploadsToRetry.length === 0) {
      return;
    }
    setFailedUploads((current) => current.filter((upload) => !uploadsToRetry.includes(upload)));
    uploadsToRetry.forEach((upload) => {
      const metadata = metadataRef.current.get(upload);
      if (metadata) {
        metadata.isDeferredRetry = true;
      }
    });
    retryBacklogRef.current.push(...uploadsToRetry);
    pumpDeferredRetries();
  }, []);

  const quality = networkStatus?.quality;
  const hasFailedUploads = failedUploads.length > 0;
  useEffect(() => {
    if (!enableAutoRetry || quality !== NetworkQuality.GOOD || !hasFailedUploads || retryingCount) {
      return undefined;
    }
    const timeout = setTimeout(retryFailed, deferredRetryDelayRef.current);
    return () => clearTimeout(timeout);
  }, [enableAutoRetry, quality, hasFailedUploads, retryingCount, retryFailed]);

  const push = useCallback(
    (upload: PictureUpload) => {
      if (upload.mode === CaptureMode.SIGHT) {
        // A new picture of a sight replaces the failed uploads of this sight, which should not be retried anymore.
        const isOutdated = (u: PictureUpload) =>
          u.mode === CaptureMode.SIGHT && u.sightId === upload.sightId;
        failedUploadsRef.current.filter(isOutdated).forEach((u) => metadataRef.current.delete(u));
        setFailedUploads((current) => current.filter((u) => !isOutdated(u)));
      }
      queue.push(upload);
    },
    [queue.push],
  );

  return {
    ...queue,
    push,
    failedUploads,
    retryingCount,
    retryFailed,
  };
}
