import { PixelDimensions } from '@monkvision/types';

/**
 * Checks if the current device is a mobile device.
 */
export function isMobileDevice(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes('mobile') ||
    userAgent.includes('android') ||
    userAgent.includes('iphone') ||
    userAgent.includes('ipad') ||
    userAgent.includes('windows phone')
  );
}

/**
 * Returns the aspect ratio of the stream.
 */
export function getAspectRatio(streamDimensions?: PixelDimensions | null) {
  if (isMobileDevice() && streamDimensions) {
    return `${streamDimensions?.width}/${streamDimensions?.height}`;
  }
  return '16/9';
}
