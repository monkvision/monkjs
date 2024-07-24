import { PixelDimensions } from '@monkvision/types';

/**
 * The ratio used to resize the dimensions of the thumbnail.
 */
export const THUMBNAIL_RESIZE_RATIO = 0.1;

function getResizedDimension(originalDimension: number): number {
  return Math.round(originalDimension * THUMBNAIL_RESIZE_RATIO);
}

/**
 * Util function that generate a thumbnail url.
 */
export function getThumbnailUrl(
  thumbnailDomain: string,
  path: string,
  dimensions: PixelDimensions,
): string {
  const baseThumbnailUrl = `https://${thumbnailDomain}${thumbnailDomain.endsWith('/') ? '' : '/'}`;
  const imageUrlParam = `image_url=${encodeURIComponent(path)}`;
  const widthUrlParam = `width=${getResizedDimension(dimensions.width)}`;
  const heightUrlParam = `height=${getResizedDimension(dimensions.height)}`;

  return `${baseThumbnailUrl}?${imageUrlParam}&${widthUrlParam}&${heightUrlParam}`;
}
