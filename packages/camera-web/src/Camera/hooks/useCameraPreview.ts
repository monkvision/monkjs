import { useMonitoring } from '@monkvision/monitoring';
import { RefObject, useEffect, useRef } from 'react';
import { CameraConfig, getMediaConstraints } from './utils';
import { UserMediaResult, useUserMedia } from './useUserMedia';

/**
 * An object containing properties used to handle the camera preview.
 */
export interface CameraPreviewHandle extends UserMediaResult {
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
  const { handleError } = useMonitoring();
  const userMediaResult = useUserMedia(getMediaConstraints(config));

  useEffect(() => {
    if (userMediaResult.stream && ref.current) {
      ref.current.srcObject = userMediaResult.stream;
      ref.current.onloadedmetadata = () => {
        ref.current?.play().catch(handleError);
      };
    }
  }, [userMediaResult.stream]);

  return {
    ref,
    ...userMediaResult,
  };
}
