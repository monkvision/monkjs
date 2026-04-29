/* eslint-disable no-param-reassign */

import { getInspectionImages, useMonkState, useObjectMemo, useQueue } from '@monkvision/common';
import { DeviceRotation, MonkPicture } from '@monkvision/types';
import { ImageUploadType, MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { useCallback, useRef } from 'react';

interface VideoFrameUpload {
  picture: MonkPicture;
  frameIndex: number;
  timestamp: number;
  retryCount: number;
  alpha: number;
}

/**
 * Params accepted by the useVideoUploadQueue hook.
 */
export interface VideoUploadQueueParams extends Pick<DeviceRotation, 'alpha'> {
  /**
   * The config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * The ID of the current inspection.
   */
  inspectionId: string;
  /**
   * The maximum number of retries allowed for failed image uploads.
   */
  maxRetryCount: number;
}

/**
 * Handle used to manage the video frame upload queue.
 */
export interface VideoUploadQueueHandle {
  /**
   * The number of frames that have successfully been uploaded to the API.
   */
  uploadedFrames: number;
  /**
   * The total number of frames added to the uploading queue.
   */
  totalUploadingFrames: number;
  /**
   * Callback called when a frame has been selected by the frame selection hook.
   */
  onFrameSelected: (picture: MonkPicture) => void;
  /**
   * Callback called when the video is discarded. Clears the upload queue and deletes all images
   * associated with the inspection in bulk using the current Monk state.
   */
  discardUploadedImages: () => void;
}

/**
 * Hook used to manage the video frame upload queue.
 */
export function useVideoUploadQueue({
  apiConfig,
  inspectionId,
  maxRetryCount,
  alpha,
}: VideoUploadQueueParams): VideoUploadQueueHandle {
  const frameIndex = useRef<number>(0);
  const frameTimestamp = useRef<number | null>(null);
  const alphaRef = useRef<number>(Math.round(alpha));
  alphaRef.current = Math.round(alpha);
  const { addImage, deleteImagesBulk } = useMonkApi(apiConfig);
  const { state } = useMonkState();
  const { handleError } = useMonitoring();

  const queue = useQueue(
    (upload: VideoFrameUpload) =>
      addImage({
        uploadType: ImageUploadType.VIDEO_FRAME,
        inspectionId,
        picture: upload.picture,
        frameIndex: upload.frameIndex,
        timestamp: upload.timestamp,
        alpha: upload.alpha,
      }),
    {
      storeFailedItems: true,
      onItemFail: (upload: VideoFrameUpload) => {
        upload.retryCount += 1;
        if (upload.retryCount <= maxRetryCount) {
          queue.push(upload);
        }
      },
    },
  );

  const onFrameSelected = useCallback(
    (picture: MonkPicture) => {
      const now = Date.now();
      const upload: VideoFrameUpload = {
        retryCount: 0,
        picture,
        frameIndex: frameIndex.current,
        timestamp: frameTimestamp.current === null ? 0 : now - frameTimestamp.current,
        alpha: alphaRef.current,
      };
      queue.push(upload);
      frameIndex.current += 1;
      frameTimestamp.current = now;
    },
    [queue.push],
  );

  const discardUploadedImages = useCallback(() => {
    queue.clear(true);
    const imageIds = getInspectionImages(inspectionId, state.images).map((img) => img.id);
    if (imageIds.length > 0) {
      deleteImagesBulk({ inspectionId, imageIds }).catch((err: unknown) => {
        handleError(err);
      });
    }
  }, [deleteImagesBulk, inspectionId, state.images, handleError, queue]);

  return useObjectMemo({
    uploadedFrames: queue.totalItems - queue.processingCount,
    totalUploadingFrames: queue.totalItems,
    onFrameSelected,
    discardUploadedImages,
  });
}
