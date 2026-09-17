import { RefObject, useEffect, useState } from 'react';
import { VideoContentRect } from '../types';
import { getVideoContentRect } from '../utils';

/**
 * The box model the content rectangle math assumes.
 *
 * `getBoundingClientRect` includes borders and padding while `object-fit` applies to the content box, so a global CSS
 * reset in a host application could otherwise shift the whole overlay. These are the UA defaults for a video element,
 * so applying them is a no-op in practice and simply makes the assumption impossible to break from the outside.
 */
const REQUIRED_VIDEO_STYLE = {
  objectFit: 'contain',
  objectPosition: '50% 50%',
  padding: '0',
  border: '0',
  display: 'block',
};

/**
 * Custom hook tracking the rectangle actually painted by the camera preview, so that the guidance overlay can be
 * positioned exactly on top of it.
 *
 * Three signals are needed to keep this up to date, and none of them can be replaced by a `window.resize` listener :
 * the layout box of the video can change without the window resizing (a sibling HUD element reflowing, or an iOS
 * pinch-zoom, which does not reliably fire `resize`), and the *intrinsic* size of the stream can change while the
 * layout box does not (iOS lowers the capture resolution under thermal pressure).
 *
 * @param videoRef Ref to the video element displaying the camera preview.
 * @param containerRef Ref to the positioning ancestor the overlay is absolutely positioned inside of.
 * @return The painted content rectangle, or null while the stream has no intrinsic dimensions yet.
 */
export function useVideoContentRect(
  videoRef: RefObject<HTMLVideoElement | null>,
  containerRef: RefObject<HTMLElement | null>,
): VideoContentRect | null {
  const [contentRect, setContentRect] = useState<VideoContentRect | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) {
      return () => {};
    }
    Object.assign(video.style, REQUIRED_VIDEO_STYLE);

    const update = () => setContentRect(getVideoContentRect(video, container));

    // IMPORTANT: The Camera component registers its own handlers using the `onloadedmetadata` and `onresize`
    // *properties* of the video element. Assigning either of those properties here would silently destroy the
    // handler that calls play() and computes the stream dimensions, freezing the preview and breaking takePicture().
    // Always use addEventListener on this element.
    video.addEventListener('loadedmetadata', update);
    video.addEventListener('resize', update);

    const observer = new ResizeObserver(update);
    observer.observe(video);
    observer.observe(container);
    update();

    return () => {
      video.removeEventListener('loadedmetadata', update);
      video.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [videoRef, containerRef]);

  return contentRect;
}
