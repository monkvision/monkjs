import { useMonitoring } from '@monkvision/monitoring';
import deepEqual from 'fast-deep-equal';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { PixelDimensions } from '@monkvision/types';
import { isMobileDevice, useObjectMemo } from '@monkvision/common';
import { getValidCameraDeviceIds } from './utils';

/**
 * Enumeration of the different Native error names that can happen when a stream is invalid.
 */
export enum InvalidStreamErrorName {
  /**
   * The stream had no video track.
   */
  NO_VIDEO_TRACK = 'NoVideoTrack',
  /**
   * The stream had too many video tracks (more than one).
   */
  TOO_MANY_VIDEO_TRACKS = 'TooManyVideoTracks',
  /**
   * The stream's video track had no dimensions.
   */
  NO_DIMENSIONS = 'NoDimensions',
}

class InvalidStreamError extends Error {
  constructor(message: string, name: InvalidStreamErrorName) {
    super(message);
    this.name = name;
  }
}

/**
 * The type of errors that the `useUserMedia` hook can return.
 *
 * @see useUserMedia
 */
export enum UserMediaErrorType {
  /**
   * The camera stream couldn't be fetched because the web page does not have the permissions to access the camera.
   */
  NOT_ALLOWED = 'not_allowed',
  /**
   * The camera stream was successfully fetched, but it could be processed. This error can happen for the following
   * reasons :
   * - The stream did not contain any video track, or contained multiple ones.
   * - The stream's video track did not have any width or height property defined.
   */
  INVALID_STREAM = 'invalid_stream',
  /**
   * The camera stream was successfully fetched, but was made inactive for some unknown reason. Some known reasons that
   * could be causing this error are :
   * - The user revoked the camera access rights of the webpage while the stream was running.
   * - On Safari, making a call to `navigator.mediaDevices.getUserMedia` will close all other existing streams on the
   * web page. When using the Monk Camera package, you need to make sure that your app does not call `getUserMedia`
   * while the camera stream is running. You can take a look at
   * [this page](https://webrtchacks.com/guide-to-safari-webrtc/) for more reading about this behaviour.
   */
  STREAM_INACTIVE = 'stream_inactive',
  /**
   * Any other error.
   */
  OTHER = 'other',
}

/**
 * Type definition for the error wrapper that the `useUserMedia` hook can return in case of error. See the
 * `UserMediaErrorType` enum for details about the type of errors that can be catched.
 *
 * @see UserMediaErrorType
 */
export interface UserMediaError {
  /**
   * The type of error that occurred.
   */
  type: UserMediaErrorType;
  /**
   * The JavaScript `Error` object containing details about the error.
   */
  nativeError: Error | unknown;
}

/**
 * Interface describing the result of the `useUserMedia` hook.
 *
 * @see useUserMedia
 */
export interface UserMediaResult {
  /**
   * The resulting video stream. The stream can be null when not initialized or in case of an error.
   */
  stream: MediaStream | null;
  /**
   * The dimensions of the resulting camera stream. Note that these dimensions can differ from the ones given in the
   * stream constraints if they are not supported or available on the current device.
   */
  dimensions: PixelDimensions | null;
  /**
   * The error details. If no error has occurred, this object will be null.
   */
  error: UserMediaError | null;
  /**
   * A loading indicator. This field is `true` while the hook is currently fetching the stream or applying new
   * constraints.
   */
  isLoading: boolean;
  /**
   * A function used to retry in case of error. If there has been no error, or if the stream is loading, this function
   * will do nothing. In case of an error, this function resets the state and tries to fetch a camera stream again.
   */
  retry: () => void;
}

function swapDimensions(dimensions: PixelDimensions): PixelDimensions {
  return {
    width: dimensions.height,
    height: dimensions.width,
  };
}

function getStreamDimensions(stream: MediaStream, checkOrientation: boolean): PixelDimensions {
  const videoTracks = stream.getVideoTracks();
  if (videoTracks.length === 0) {
    throw new InvalidStreamError(
      'Unable to set up the Monk camera screenshoter because the video stream does contain any video tracks.',
      InvalidStreamErrorName.NO_VIDEO_TRACK,
    );
  }
  if (videoTracks.length > 1) {
    throw new InvalidStreamError(
      'Unable to set up the Monk camera screenshoter because the video stream contains multiple video tracks.',
      InvalidStreamErrorName.TOO_MANY_VIDEO_TRACKS,
    );
  }
  const { width, height } = stream.getVideoTracks()[0].getSettings();
  if (!width || !height) {
    throw new InvalidStreamError(
      'Unable to set up the Monk camera screenshoter because the video stream does not have the properties width and height defined.',
      InvalidStreamErrorName.NO_DIMENSIONS,
    );
  }
  const dimensions = { width, height };
  if (!isMobileDevice() || !checkOrientation) {
    return dimensions;
  }

  const isStreamInPortrait = width < height;
  const isDeviceInPortrait = window.matchMedia('(orientation: portrait)').matches;
  return isStreamInPortrait !== isDeviceInPortrait ? swapDimensions(dimensions) : dimensions;
}

/**
 * React hook that wraps the `navigator.mediaDevices.getUserMedia` browser function in order to add React logic layers
 * and utility tools :
 * - Creates an effect for `getUserMedia` that will be run everytime some state parameters are updated.
 * - Will call `track.applyConstraints` when the video contstraints are updated in order to update the video stream.
 * - Makes sure that the `getUserMedia` is only called when it needs to be using memoized state.
 * - Provides various utilities such as error catching, loading information and a retry on failure feature.
 *
 * @param constraints The same media constraints you would pass to the `getUserMedia` function. Note that this hook has
 * been designed for video only, so audio constraints could provoke unexpected behaviour.
 * @param videoRef The ref to the video element displaying the camera preview stream.
 * @return The result of this hook contains the resulting video stream, an error object if there has been an error, a
 * loading indicator and a retry function that tries to get a camera stream again. See the `UserMediaResult` interface
 * for more information.
 * @see UserMediaResult
 */
export function useUserMedia(
  constraints: MediaStreamConstraints,
  videoRef: RefObject<HTMLVideoElement>,
): UserMediaResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [dimensions, setDimensions] = useState<PixelDimensions | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UserMediaError | null>(null);
  const [lastConstraintsApplied, setLastConstraintsApplied] =
    useState<MediaStreamConstraints | null>(null);
  const { handleError } = useMonitoring();
  const isActive = useRef(true);

  useEffect(() => {
    return () => {
      isActive.current = false;
    };
  }, []);

  const handleGetUserMediaError = (err: unknown) => {
    let type = UserMediaErrorType.OTHER;
    if (err instanceof Error && err.name === 'NotAllowedError') {
      type = UserMediaErrorType.NOT_ALLOWED;
    } else if (
      err instanceof Error &&
      Object.values(InvalidStreamErrorName).includes(err.name as InvalidStreamErrorName)
    ) {
      type = UserMediaErrorType.INVALID_STREAM;
    }
    setError({ type, nativeError: err });
    setStream(null);
    setIsLoading(false);
  };

  const onStreamInactive = () => {
    setError({
      type: UserMediaErrorType.STREAM_INACTIVE,
      nativeError: new Error('The camera stream was closed.'),
    });
    setIsLoading(false);
  };

  const retry = useCallback(() => {
    if (error && !isLoading) {
      setError(null);
      setStream(null);
      setIsLoading(false);
      setLastConstraintsApplied(null);
    }
  }, [error, isLoading]);

  useEffect(() => {
    if (error || isLoading || deepEqual(lastConstraintsApplied, constraints)) {
      return;
    }
    setLastConstraintsApplied(constraints);

    const getUserMedia = async () => {
      try {
        setIsLoading(true);
        if (stream) {
          stream.removeEventListener('inactive', onStreamInactive);
          stream.getTracks().forEach((track) => track.stop());
        }
        const cameraDeviceIds = await getValidCameraDeviceIds(constraints);
        const updatedConstraints = {
          ...constraints,
          video: {
            ...(constraints ? (constraints.video as MediaTrackConstraints) : {}),
            deviceId: { exact: cameraDeviceIds },
          },
        };
        const str = await navigator.mediaDevices.getUserMedia(updatedConstraints);
        str?.addEventListener('inactive', onStreamInactive);
        if (isActive.current) {
          setStream(str);
          setDimensions(getStreamDimensions(str, true));
          setIsLoading(false);
        }
      } catch (err) {
        if (isActive.current) {
          handleGetUserMediaError(err);
          throw err;
        }
      }
    };
    getUserMedia().catch(handleError);
  }, [constraints, stream, error, isLoading, lastConstraintsApplied]);

  useEffect(() => {
    if (stream && videoRef.current) {
      // eslint-disable-next-line no-param-reassign
      videoRef.current.onresize = () => {
        if (isActive.current) {
          setDimensions(getStreamDimensions(stream, false));
        }
      };
    }
  }, [stream]);

  return useObjectMemo({ stream, dimensions, error, retry, isLoading });
}
