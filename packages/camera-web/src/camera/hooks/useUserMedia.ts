import { useMonitoring } from '@monkvision/monitoring';
import deepEqual from 'fast-deep-equal';
import { useCallback, useEffect, useState } from 'react';

type MediaTrackKind = 'audio' | 'video';

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
 * Type definition for the error wrapper that the `useUserMedia` can return in case of error. See the
 * `UserMediaErrorType` enum for details about the type of errors that can be catched.
 *
 * @see useUserMedia
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
 * @return The result of this hook contains the resulting video stream, an error object if there has been an error, a
 * loading indicator and a retry function that tries to get a camera stream again. See the `UserMediaResult` interface
 * for more information.
 * @see UserMediaResult
 */
export function useUserMedia(constraints: MediaStreamConstraints): UserMediaResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UserMediaError | null>(null);
  const [lastConstraintsApplied, setLastConstraintsApplied] =
    useState<MediaStreamConstraints | null>(null);
  const { handleError } = useMonitoring();

  const handleGetUserMediaError = useCallback((err: unknown) => {
    const type =
      err instanceof Error && err.name === 'NotAllowedError'
        ? UserMediaErrorType.NOT_ALLOWED
        : UserMediaErrorType.OTHER;
    setError({ type, nativeError: err });
    setIsLoading(false);
  }, []);

  const onStreamInactive = useCallback(() => {
    setError({
      type: UserMediaErrorType.STREAM_INACTIVE,
      nativeError: new Error('The camera stream was closed.'),
    });
    setIsLoading(false);
  }, []);

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
      return () => {};
    }
    setLastConstraintsApplied(constraints);

    if (stream) {
      setIsLoading(true);
      stream.getTracks().forEach((track) => {
        const trackConstraints = constraints[track.kind as MediaTrackKind];
        const constraintsToApply: MediaTrackConstraints | undefined =
          typeof trackConstraints === 'boolean' ? {} : trackConstraints;
        track
          .applyConstraints(constraintsToApply)
          .catch((err) => handleError(err))
          .finally(() => setIsLoading(false));
      });
      return () => {};
    }

    let didCancel = false;
    const getUserMedia = async () => {
      try {
        setIsLoading(true);
        const str = await navigator.mediaDevices.getUserMedia(constraints);
        if (!didCancel) {
          str?.addEventListener('inactive', onStreamInactive);
          setStream(str);
          setIsLoading(false);
        }
      } catch (err) {
        if (!didCancel) {
          handleGetUserMediaError(err);
        }
        throw err;
      }
    };

    if (!stream) {
      getUserMedia().catch((err) => handleError(err));
      return () => {};
    }
    return () => {
      didCancel = true;
    };
  }, [constraints, stream, error, isLoading, lastConstraintsApplied, onStreamInactive]);

  return { stream, error, retry, isLoading };
}
