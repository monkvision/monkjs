import { useMonkState, useObjectMemo } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useCallback } from 'react';
import { Image, SharedCaptureAppConfig } from '@monkvision/types';
import { UploadEventHandlers, UploadSuccessPayload } from './useUploadQueue';

/**
 * Parameters accepted by the useImagesCleanup hook.
 */
export interface ImagesCleanupParams
  extends Pick<SharedCaptureAppConfig, 'autoDeletePreviousSightImages'> {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
}

/**
 * Handle used to manage the images cleanup after a new one uploads.
 */
export interface ImagesCleanupHandle {
  /**
   * A set of event handlers listening to upload events.
   */
  cleanupEventHandlers: UploadEventHandlers;
}

function extractOtherImagesToDelete(imagesBySight: Record<string, Image[]>): Image[] {
  const imagesToDelete: Image[] = [];

  Object.values(imagesBySight)
    .filter((images) => images.length > 1)
    .forEach((images) => {
      const sortedImages = images.sort((a, b) =>
        b.createdAt && a.createdAt ? b.createdAt - a.createdAt : 0,
      );
      imagesToDelete.push(...sortedImages.slice(1));
    });

  return imagesToDelete;
}

function groupImagesBySightId(images: Image[], sightIdToSkip: string): Record<string, Image[]> {
  return images.reduce((acc, image) => {
    if (!image.sightId || image.sightId === sightIdToSkip) {
      return acc;
    }
    if (!acc[image.sightId]) {
      acc[image.sightId] = [];
    }

    acc[image.sightId].push(image);
    return acc;
  }, {} as Record<string, Image[]>);
}

/**
 * Custom hook used to cleanup sights' images of the inspection by deleting the old ones
 * when a new image is added.
 */
export function useImagesCleanup({
  inspectionId,
  apiConfig,
  autoDeletePreviousSightImages = true,
}: ImagesCleanupParams): ImagesCleanupHandle {
  const { deleteImage } = useMonkApi(apiConfig);
  const { state } = useMonkState();

  const onUploadSuccess = useCallback(
    ({ sightId, imageId }: UploadSuccessPayload) => {
      if (!sightId || !autoDeletePreviousSightImages) {
        return;
      }

      const otherImagesToDelete = extractOtherImagesToDelete(
        groupImagesBySightId(state.images, sightId),
      );

      const sightImagesToDelete = state.images.filter(
        (image) =>
          image.inspectionId === inspectionId && image.sightId === sightId && image.id !== imageId,
      );

      const imagesToDelete = [...otherImagesToDelete, ...sightImagesToDelete];

      if (imagesToDelete.length > 0) {
        imagesToDelete.forEach((image) => deleteImage({ imageId: image.id, id: inspectionId }));
      }
    },
    [state.images, inspectionId],
  );

  return useObjectMemo({
    cleanupEventHandlers: {
      onUploadSuccess,
    },
  });
}
