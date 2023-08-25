import { useMonitoring } from '@monkvision/monitoring';
import { RefObject, useEffect, useRef } from 'react';
import { CameraOptions, useMediaConstraints } from './useMediaConstraints';
import { UserMediaResult, useUserMedia } from './useUserMedia';

/**
 * Configuration options for the Monk camera.
 */
export interface CameraConfig {
  /**
   * Specification options for the camera device. See the `CameraOptions` type for more details.
   *
   * @see CameraOptions
   */
  options?: CameraOptions;
}

/**
 * An object containing properties used to handle the camera preview.
 */
export interface CameraPreviewDetails extends UserMediaResult {
  /**
   * React MutableRefObject referencing the video element displaying the camera preview.
   */
  videoRef: RefObject<HTMLVideoElement>;
}

/**
 * Custom hook used to initialize and handle the camera preview. It initializes the camera stream based on the given
 * configuration, and provides a handle to manage the camera such as the ref to the video element etc.
 *
 * @param options Optional configuration options for the camera.
 * @return A set of properties used to manage the camera preview.
 */
export function useCameraPreview({ options }: CameraConfig = {}): CameraPreviewDetails {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { handleError } = useMonitoring();
  const constraints = useMediaConstraints(options);
  const userMediaResult = useUserMedia(constraints);

  useEffect(() => {
    if (userMediaResult.stream && videoRef.current) {
      videoRef.current.srcObject = userMediaResult.stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((err) => handleError(err));
      };
    }
  }, [userMediaResult.stream]);

  return {
    videoRef,
    ...userMediaResult,
  };
}
