import { Image, THUMBNAIL_RESIZE_RATIO } from '@monkvision/types';
import { useCallback } from 'react';
import { useObjectMemo } from './useObjectMemo';

/**
 * The result of the useThumbnail. It contains a function which takes a Image object and return the
 * thumbnail url.
 */
export interface ThumbnailResult {
  /**
   * Function that generates the thumbnail image URL.
   */
  getThumbnailUrl: (image: Image) => string;
}

function getResizedDimension(originalDimension: number): number {
  return Math.round(originalDimension * THUMBNAIL_RESIZE_RATIO);
}

/**
 * Custom hook used to get a function getThumbnailUrl that generates a thumbnail URL.
 */
export function useThumbnail(thumbnailDomain: string): ThumbnailResult {
  const getThumbnailUrl = useCallback(
    (image: Image) => {
      const baseThumbnailUrl = `https://${thumbnailDomain}${
        thumbnailDomain.endsWith('/') ? '' : '/'
      }`;
      const imageUrlParam = `image_url=${encodeURIComponent(image.path)}`;
      const widthUrlParam = `width=${getResizedDimension(image.width)}`;
      const heightUrlParam = `height=${getResizedDimension(image.height)}`;

      return `${baseThumbnailUrl}?${imageUrlParam}&${widthUrlParam}&${heightUrlParam}`;
    },
    [thumbnailDomain],
  );

  return useObjectMemo({ getThumbnailUrl });
}
