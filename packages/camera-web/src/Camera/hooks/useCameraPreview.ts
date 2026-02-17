import { useMonitoring } from '@monkvision/monitoring';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { PixelDimensions } from '@monkvision/types';
import { useWindowDimensions } from '@monkvision/common';
import { CameraConfig, getMediaConstraints } from './utils';
import {
  getStreamVideoTrackSettings,
  InvalidStreamError,
  InvalidStreamErrorName,
  UserMediaResult,
  useUserMedia,
} from './useUserMedia';

function getStreamDimensionsFromVideo(
  videoElement: HTMLVideoElement,
  stream: MediaStream,
): PixelDimensions | null {
  const { width, height } = getStreamVideoTrackSettings(stream);
  if (!height || !width) {
    throw new InvalidStreamError(
      'Unable to set up the Monk camera screenshoter because the video stream does not have the properties width and height defined.',
      InvalidStreamErrorName.NO_DIMENSIONS,
    );
  }

  const videoIsLandscape = videoElement.videoWidth > videoElement.videoHeight;
  const maxDimension = Math.max(width, height);
  const minDimension = Math.min(width, height);

  return videoIsLandscape
    ? { width: maxDimension, height: minDimension }
    : { width: minDimension, height: maxDimension };
}

function getPreviewDimensions(videoElement: HTMLVideoElement, windowDimensions: PixelDimensions) {
  const height = videoElement.videoHeight;
  const width = videoElement.videoWidth;

  if (!windowDimensions || !height || !width) {
    return null;
  }
  const windowAspectRatio = windowDimensions.width / windowDimensions.height;
  const streamAspectRatio = width / height;

  return windowAspectRatio >= streamAspectRatio
    ? {
        width: windowDimensions.height * streamAspectRatio,
        height: windowDimensions.height,
      }
    : {
        width: windowDimensions.width,
        height: windowDimensions.width / streamAspectRatio,
      };
}

/**
 * An object containing properties used to handle the camera preview.
 */
export interface CameraPreviewHandle extends UserMediaResult {
  /**
   * The actual dimensions of the camera stream (full resolution).
   */
  streamDimensions: PixelDimensions | null;
  /**
   * The effective pixel dimensions of the video stream on the client screen (scaled for display).
   */
  previewDimensions: PixelDimensions | null;
  /**
   * React MutableRefObject referencing the video element displaying the camera preview.
   */
  ref: RefObject<HTMLVideoElement | null>;
}

/**
 * Custom hook used to initialize and handle the camera preview. It initializes the camera stream based on the given
 * configuration, and provides a handle to manage the camera such as the ref to the video element etc.
 */
export function useCameraPreview(config: CameraConfig): CameraPreviewHandle {
  const ref = useRef<HTMLVideoElement>(null);
  const [streamDimensions, setStreamDimensions] = useState<PixelDimensions | null>(null);
  const [previewDimensions, setPreviewDimensions] = useState<PixelDimensions | null>(null);
  const windowDimensions = useWindowDimensions();
  const { handleError } = useMonitoring();
  const userMediaResult = useUserMedia(getMediaConstraints(config), ref);

  useEffect(() => {
    const currentRef = ref.current;

    if (userMediaResult.stream && currentRef) {
      currentRef.srcObject = userMediaResult.stream;

      const updateDimensions = () => {
        if (!currentRef || !userMediaResult.stream) {
          return;
        }

        const streamDims = getStreamDimensionsFromVideo(currentRef, userMediaResult.stream);
        if (streamDims && windowDimensions) {
          setStreamDimensions(streamDims);
          setPreviewDimensions(getPreviewDimensions(currentRef, windowDimensions));
        }
      };

      const handleMetadata = () => {
        currentRef?.play().catch(handleError);
        updateDimensions();
      };

      const handleResize = () => {
        updateDimensions();
      };

      currentRef.onloadedmetadata = handleMetadata;
      currentRef.onresize = handleResize;
    }

    return () => {
      if (currentRef) {
        currentRef.onloadedmetadata = null;
        currentRef.onresize = null;
      }
    };
  }, [windowDimensions, userMediaResult.stream, handleError]);

  return useMemo(
    () => ({
      ref,
      streamDimensions,
      previewDimensions,
      ...userMediaResult,
    }),
    [streamDimensions, previewDimensions, userMediaResult],
  );
}
