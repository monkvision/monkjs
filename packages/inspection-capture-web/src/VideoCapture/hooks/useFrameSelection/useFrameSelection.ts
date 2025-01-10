import { useCallback, useRef } from 'react';
import { MonkPicture } from '@monkvision/types';
import { useInterval, useObjectMemo, useQueue } from '@monkvision/common';
import { CameraHandle } from '@monkvision/camera-web';
import { useMonitoring } from '@monkvision/monitoring';
import { calculateLaplaceScores } from './laplaceScores';

/**
 * Params accepted by the useFrameSelection hook.
 */
export interface UseFrameSelectionParams {
  /**
   * The camera handle.
   */
  handle: CameraHandle;
  /**
   * Interval (in milliseconds) at which camera frames should be taken.
   */
  frameSelectionInterval: number;
  /**
   * Callback called when a frame has been selected and should be uploaded to the API.
   */
  onFrameSelected?: (picture: MonkPicture) => void;
}

/**
 * Handle used to manage the frame selection feature.
 */
export interface FrameSelectionHandle {
  /**
   * The number of frames that have successfully been processed and added to the upload queue.
   */
  processedFrames: number;
  /**
   * The total number of frames added to the processing queue.
   */
  totalProcessingFrames: number;
  /**
   * Callback called when a video frame should be captured.
   */
  onCaptureVideoFrame: () => void;
}

/**
 * Custom hook used to manage the video frame selection. Basically, every time a camera screenshot is taken, it is added
 * to the frame selection processing queue. The blurriness score of the screenshot is calculated, and the best video
 * frame (the less blurry one) is always stored in memory. Finally, every `frameSelectionInterval` milliseconds, the
 * best video frame is "selected" (to be uploaded to the API) and the process resets.
 */
export function useFrameSelection({
  handle,
  frameSelectionInterval,
  onFrameSelected,
}: UseFrameSelectionParams): FrameSelectionHandle {
  const bestScore = useRef<number | null>(null);
  const bestFrame = useRef<ImageData | null>(null);
  const { handleError } = useMonitoring();

  const processingQueue = useQueue(
    (image: ImageData) =>
      new Promise<void>((resolve) => {
        // Note : Other array-copying methods might result in performance issues
        const imagePixelsCopy = image.data.slice();
        const laplaceScores = calculateLaplaceScores(imagePixelsCopy, image.width, image.height);
        if (bestScore.current === null || laplaceScores.std > bestScore.current) {
          bestScore.current = laplaceScores.std;
          bestFrame.current = image;
        }
        resolve();
      }),
    { storeFailedItems: false },
  );

  const onCaptureVideoFrame = useCallback(() => {
    processingQueue.push(handle.getImageData());
  }, [processingQueue.push]);

  useInterval(() => {
    if (bestFrame.current !== null) {
      handle
        .compressImage(bestFrame.current)
        .then((picture) => onFrameSelected?.(picture))
        .catch(handleError);
    }
    bestScore.current = null;
    bestFrame.current = null;
  }, frameSelectionInterval);

  return useObjectMemo({
    processedFrames: processingQueue.totalItems - processingQueue.processingCount,
    totalProcessingFrames: processingQueue.totalItems,
    onCaptureVideoFrame,
  });
}
