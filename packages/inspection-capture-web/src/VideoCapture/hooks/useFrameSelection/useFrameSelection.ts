import { useCallback, useEffect, useRef, useState } from 'react';
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
   * Interval (in milliseconds) at which camera frames should be taken. Ignored if `flushTrigger` is provided.
   */
  frameSelectionInterval: number;
  /**
   * If provided, the best buffered frame is flushed every time this value changes, instead of relying on
   * `frameSelectionInterval`.
   *
   * Used for `VideoUploadStrategy.ADAPTIVE_UPLOAD_RATE` strategy.
   */
  flushTrigger?: number;
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
  /**
   * Callback used to upload the currently buffered best frame (if any) to the API, and reset the buffer. Used by the
   * `VideoUploadStrategy.ADAPTIVE_UPLOAD_RATE` strategy to flush the frame captured in the last angular bucket of the
   * walkaround, once the recording is complete.
   */
  flushBestFrame: () => void;
  /**
   * Callback used to discard the currently buffered best frame (if any), without uploading it. Used every time the
   * buffered frame should not be trusted anymore: when the recording is paused (the frame may no longer match the
   * angle at which the recording resumes), when a new walkaround starts, or when the current recording is discarded.
   */
  discardBestFrame: () => void;
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
  flushTrigger,
  onFrameSelected,
}: UseFrameSelectionParams): FrameSelectionHandle {
  const bestScore = useRef<number | null>(null);
  const bestFrame = useRef<ImageData | null>(null);
  const generation = useRef(0);
  const [startedFlushes, setStartedFlushes] = useState(0);
  const [settledFlushes, setSettledFlushes] = useState(0);
  const { handleError } = useMonitoring();

  const processingQueue = useQueue(
    (image: ImageData) =>
      new Promise<void>((resolve) => {
        const laplaceScores = calculateLaplaceScores(image.data, image.width, image.height);
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

  const flushBestFrame = useCallback(() => {
    const frame = bestFrame.current;
    bestScore.current = null;
    bestFrame.current = null;
    if (frame === null) {
      return;
    }
    const flushGeneration = generation.current;
    setStartedFlushes((count) => count + 1);
    handle
      .compressImage(frame)
      .then((picture) => {
        if (flushGeneration === generation.current) {
          onFrameSelected?.(picture);
        }
      })
      .catch(handleError)
      .finally(() => setSettledFlushes((count) => count + 1));
  }, [handle, onFrameSelected, handleError]);

  const discardBestFrame = useCallback(() => {
    generation.current += 1;
    bestScore.current = null;
    bestFrame.current = null;
  }, []);

  useInterval(flushBestFrame, flushTrigger === undefined ? frameSelectionInterval : null);

  useEffect(() => {
    if (flushTrigger === undefined) {
      return;
    }
    flushBestFrame();
  }, [flushTrigger]);

  return useObjectMemo({
    processedFrames: processingQueue.totalItems - processingQueue.processingCount + settledFlushes,
    totalProcessingFrames: processingQueue.totalItems + startedFlushes,
    onCaptureVideoFrame,
    flushBestFrame,
    discardBestFrame,
  });
}
