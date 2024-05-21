import { useMonitoring } from '@monkvision/monitoring';
import { RefObject, useEffect, useMemo, useRef } from 'react';
import { PixelDimensions } from '@monkvision/types';
import { useWindowDimensions } from '@monkvision/common';
import { CameraConfig, getMediaConstraints } from './utils';
import { UserMediaResult, useUserMedia } from './useUserMedia';

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
  ref: RefObject<HTMLVideoElement>;
}

/**
 * Custom hook used to initialize and handle the camera preview. It initializes the camera stream based on the given
 * configuration, and provides a handle to manage the camera such as the ref to the video element etc.
 */
export function useCameraPreview(config: CameraConfig): CameraPreviewHandle {
  const ref = useRef<HTMLVideoElement>(null);
  const windowDimensions = useWindowDimensions();
  const { handleError } = useMonitoring();
  const userMediaResult = useUserMedia(getMediaConstraints(config), ref);

  const previewDimensions = useMemo(() => {
    if (!windowDimensions || !userMediaResult.dimensions) {
      return null;
    }
    const windowAspectRatio = windowDimensions.width / windowDimensions.height;
    const streamAspectRatio = userMediaResult.dimensions.width / userMediaResult.dimensions.height;

    return windowAspectRatio >= streamAspectRatio
      ? {
          width: windowDimensions.height * streamAspectRatio,
          height: windowDimensions.height,
        }
      : {
          width: windowDimensions.width,
          height: windowDimensions.width / streamAspectRatio,
        };
  }, [windowDimensions, userMediaResult.dimensions]);

  useEffect(() => {
    if (userMediaResult.stream && ref.current) {
      ref.current.srcObject = userMediaResult.stream;
      ref.current.onloadedmetadata = () => {
        ref.current?.play().catch(handleError);
      };
    }
  }, [userMediaResult.stream]);

  return useMemo(
    () => ({
      ref,
      previewDimensions,
      ...userMediaResult,
    }),
    [previewDimensions, userMediaResult],
  );
}
