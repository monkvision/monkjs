import { useMonitoring } from '@monkvision/monitoring';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { PixelDimensions } from '@monkvision/types';
import { useWindowDimensions } from '@monkvision/common';
import { CameraConfig, getMediaConstraints } from './utils';
import { UserMediaResult, useUserMedia } from './useUserMedia';

function getPreviewDimensions(refVideo: HTMLVideoElement, windowDimensions: PixelDimensions) {
  const height = refVideo.videoHeight;
  const width = refVideo.videoWidth;

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
   * The effective pixel dimensions of the video stream on the client screen.
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
  const [previewDimensions, setPreviewDimensions] = useState<PixelDimensions | null>(null);
  const windowDimensions = useWindowDimensions();
  const { handleError } = useMonitoring();
  const userMediaResult = useUserMedia(getMediaConstraints(config), ref);

  useEffect(() => {
    const currentRef = ref.current;

    if (userMediaResult.stream && currentRef) {
      currentRef.srcObject = userMediaResult.stream;

      const handleMetadata = () => {
        currentRef?.play().catch(handleError);
        if (currentRef) {
          setPreviewDimensions(getPreviewDimensions(currentRef, windowDimensions));
        }
      };

      const handleResize = () => {
        if (currentRef) {
          setPreviewDimensions(getPreviewDimensions(currentRef, windowDimensions));
        }
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
      previewDimensions,
      ...userMediaResult,
    }),
    [previewDimensions, userMediaResult],
  );
}
