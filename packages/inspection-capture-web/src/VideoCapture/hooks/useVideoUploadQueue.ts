/* eslint-disable no-param-reassign */

import { useObjectMemo, useQueue } from '@monkvision/common';
import { MonkPicture } from '@monkvision/types';
import { ImageUploadType, MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useCallback, useRef } from 'react';

interface VideoFrameUpload {
  picture: MonkPicture;
  frameIndex: number;
  timestamp: number;
  retryCount: number;
}

/**
 * Params accepted by the useVideoUploadQueue hook.
 */
export interface VideoUploadQueueParams {
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
}

/**
 * Hook used to manage the video frame upload queue.
 */
export function useVideoUploadQueue({
  apiConfig,
  inspectionId,
  maxRetryCount,
}: VideoUploadQueueParams): VideoUploadQueueHandle {
  const frameIndex = useRef<number>(0);
  const frameTimestamp = useRef<number | null>(null);
  const { addImage } = useMonkApi(apiConfig);

  const queue = useQueue(
    (upload: VideoFrameUpload) =>
      addImage({
        uploadType: ImageUploadType.VIDEO_FRAME,
        inspectionId,
        picture: upload.picture,
        frameIndex: upload.frameIndex,
        timestamp: upload.timestamp,
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
      };
      queue.push(upload);
      frameIndex.current += 1;
      frameTimestamp.current = now;
    },
    [queue.push],
  );

  return useObjectMemo({
    uploadedFrames: queue.totalItems - queue.processingCount,
    totalUploadingFrames: queue.totalItems,
    onFrameSelected,
  });
}
