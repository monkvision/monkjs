import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { getInspectionImages, LoadingState, useAsyncEffect } from '@monkvision/common';
import { Image, ProgressStatus } from '@monkvision/types';
import { useState } from 'react';

const BUCKET_COUNT = 6;
const BUCKET_SIZE = 360 / BUCKET_COUNT;
const MIN_IMAGES_PER_BUCKET = 1;

/**
 * Checks whether the inspection already has enough car coverage based on the alpha values of its
 * images. The 360° space is split into 6 equal buckets (60° each), and each bucket must contain at
 * least 1 image for the coverage to be considered sufficient.
 *
 * @param images The images to evaluate.
 */
export function hasEnoughCarCoverage(images: Image[]): boolean {
  const buckets = new Array<number>(BUCKET_COUNT).fill(0);

  images.forEach((image) => {
    const alpha = image.additionalData?.alpha;
    if (alpha === undefined || alpha === null) {
      return;
    }
    const normalizedAlpha = alpha % 360;
    const bucketIndex = Math.min(Math.floor(normalizedAlpha / BUCKET_SIZE), BUCKET_COUNT - 1);
    buckets[bucketIndex] += 1;
  });

  return buckets.every((count) => count >= MIN_IMAGES_PER_BUCKET);
}

/**
 * Params accepted by the useGetInspection hook.
 */
export interface UseGetInspectionParams {
  /**
   * The ID of the inspection to fetch.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * Global loading state of the VideoCapture component.
   */
  loading: LoadingState;
  /**
   * Whether hybrid video mode is enabled. Used to determine if video can be skipped.
   */
  enableHybridVideo: boolean;
  /**
   * Callback called when the inspection is found to be already completed.
   */
  onCompleted?: () => void;
  /**
   * Callback called when the coverage check determines the video step should be skipped.
   */
  onShouldSkipVideo?: () => void;
}

/**
 * Return value of the useGetInspection hook.
 */
export interface UseGetInspectionResult {
  /**
   * Whether the inspection is completed (has any task with status other than NOT_STARTED).
   */
  isInspectionCompleted: boolean;
  /**
   * Whether the video step should be skipped because the inspection already has enough car coverage.
   */
  shouldSkipVideo: boolean;
}

/**
 * Custom hook that fetches the inspection details when the VideoCapture component mounts.
 * This ensures the inspection data is available in the Monk state for the video capture process.
 * It also determines if the inspection is already completed by checking task statuses,
 * and whether the video capture can be skipped based on existing 360° car coverage.
 * When coverage is insufficient and the inspection is not completed, existing images are deleted.
 */
export function useGetInspection({
  inspectionId,
  apiConfig,
  loading,
  enableHybridVideo,
  onCompleted,
  onShouldSkipVideo,
}: UseGetInspectionParams): UseGetInspectionResult {
  const { getInspection, deleteImagesBulk } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();
  const [isInspectionCompleted, setIsInspectionCompleted] = useState(false);
  const [shouldSkipVideo, setShouldSkipVideo] = useState(false);

  useAsyncEffect(
    () => {
      loading.start();
      return getInspection({ id: inspectionId });
    },
    [inspectionId],
    {
      onResolve: (result) => {
        const tasks = result.entities.tasks ?? [];
        const completed = tasks.some((task) => task.status !== ProgressStatus.NOT_STARTED);
        setIsInspectionCompleted(completed);
        if (completed) {
          onCompleted?.();
          loading.onSuccess();
          return;
        }

        const images = getInspectionImages(inspectionId, result.entities.images);
        const skipVideo = enableHybridVideo && hasEnoughCarCoverage(images);
        setShouldSkipVideo(skipVideo);

        if (skipVideo) {
          onShouldSkipVideo?.();
        } else if (images.length > 0) {
          const imageIds = images.map((img) => img.id);
          deleteImagesBulk({ inspectionId, imageIds }).catch((err) => {
            handleError(err);
          });
        }

        loading.onSuccess();
      },
      onReject: (err) => {
        handleError(err);
        loading.onError(err);
      },
    },
  );

  return { isInspectionCompleted, shouldSkipVideo };
}
