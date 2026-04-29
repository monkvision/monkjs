import { useEffect, useRef } from 'react';
import { Image } from '@monkvision/types';
import { getInspectionImages, useMonkState } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';

const BUCKET_COUNT = 6;
const BUCKET_SIZE = 360 / BUCKET_COUNT;
const MIN_IMAGES_PER_BUCKET = 1;

/**
 * Checks whether the inspection already has enough car coverage based on the alpha values of its
 * images. The 360° space is split into 6 equal buckets (60° each), and each bucket must contain at
 * least 5 images for the coverage to be considered sufficient.
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
 * Params accepted by the useCarCoverageCheck hook.
 */
export interface UseCarCoverageCheckParams {
  /**
   * The ID of the inspection to check coverage for.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * Whether hybrid video mode is enabled. The check is only performed in hybrid mode.
   */
  enableHybridVideo: boolean;
}

/**
 * Custom hook that checks if the current inspection already has enough 360° car coverage to skip
 * the video capture step. It evaluates the alpha values from ImageAdditionalData, splitting the
 * 360° space into 6 buckets of 60° each, and returns `true` if every bucket contains at least 5
 * images. When coverage is insufficient, it deletes all existing inspection images on mount to
 * ensure a fresh start before video capture begins.
 */
export function useCarCoverageCheck({
  inspectionId,
  apiConfig,
  enableHybridVideo,
}: UseCarCoverageCheckParams): boolean {
  const { state } = useMonkState();
  const { deleteImagesBulk } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();
  const hasDeletedRef = useRef(false);

  const inspectionImages = getInspectionImages(inspectionId, state.images);
  const shouldSkipVideo = enableHybridVideo && hasEnoughCarCoverage(inspectionImages);

  useEffect(() => {
    if (hasDeletedRef.current || shouldSkipVideo) {
      return;
    }
    const imageIds = inspectionImages.map((img) => img.id);
    if (imageIds.length > 0) {
      hasDeletedRef.current = true;
      deleteImagesBulk({ inspectionId, imageIds }).catch((err) => {
        handleError(err);
      });
    }
  }, [state.images]);

  return shouldSkipVideo;
}
