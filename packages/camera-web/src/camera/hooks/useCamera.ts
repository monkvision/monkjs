import { useMonitoring } from '@monkvision/monitoring';
import { MutableRefObject, useEffect, useRef } from 'react';
import { CameraOptions, useMediaConstraints } from './useMediaConstraints';
import { UserMediaError, useUserMedia } from './useUserMedia';

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
 * An object containing utilities used to handle the Monk camera. This set of handles is obtained using the `useCamera`
 * hook.
 */
export interface CameraHandles {
  /**
   * React MutableRefObject referencing the video element displaying the camera preview.
   */
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  /**
   * The error object if there has been one. See `UserMediaResult.error` for more details.
   *
   * @see UserMediaResult.error
   */
  error: UserMediaError | null;
  /**
   * The retry in case of error function. See `UserMediaResult.retry` for more details.
   *
   * @see UserMediaResult.retry
   */
  retry: () => void;
}

/**
 * Custom hook used to initialize and handle the camera. It initializes the camera stream based on the given
 * configuration, and provides handles to manage the camera such as taking pictures etc...
 *
 * @param options Optional configuration options for the camera.
 * @return A set of handles for the camera.
 */
export function useCamera({ options }: CameraConfig = {}): CameraHandles {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { handleError } = useMonitoring();
  const constraints = useMediaConstraints(options);
  const { stream, error, retry } = useUserMedia(constraints);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch((err) => handleError(err));
      };
    }
  }, [stream]);

  return {
    videoRef,
    error,
    retry,
  };
}
