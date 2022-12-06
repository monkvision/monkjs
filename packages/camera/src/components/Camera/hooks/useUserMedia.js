import { useState, useEffect, useCallback, useMemo } from 'react';
import useStreamGuard from './useStreamGuard';

/**
 * `useUserMedia` is a hook that takes an objects `constraints`, and returns an object
 * of `stream` and `error`.
 */
function useUserMedia({
  constraints = { audio: false, video: false },
  onCameraPermissionError,
  onCameraPermissionSuccess,
}) {
// function useUserMedia(constraints = { audio: false, video: false }) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const handleCameraPermissionError = useMemo(() => (typeof onCameraPermissionError === 'function'
    ? onCameraPermissionError : () => {}), [onCameraPermissionError]);
  const handleCameraPermissionSuccess = useMemo(() => (typeof onCameraPermissionSuccess === 'function'
    ? onCameraPermissionSuccess : () => {}), [onCameraPermissionSuccess]);

  useStreamGuard(stream, useCallback(() => {
    console.warn('@monkvision/camera\'s stream has been unexpectedly ended. '
      + 'This can happen if mediaDevices.getUserMedia was called after the camera component was initialized. '
      + 'Restarting the stream right now...');
    setStream(null);
  }, [setStream]));

  useEffect(() => {
    if (stream) {
      // if the stream already exist and we get a value change, we apply these constraints
      stream.getTracks().forEach((track) => track.applyConstraints(constraints[track.kind]));
      return () => {};
    }
    let didCancel = false;

    const getUserMedia = async () => {
      try {
        const str = await navigator.mediaDevices.getUserMedia(constraints)
          .then(handleCameraPermissionSuccess, handleCameraPermissionError);
        if (!didCancel) { setStream(str); }
      } catch (err) {
        if (!didCancel) { setError(err); }
      }
    };

    getUserMedia();

    if (!stream) { return () => {}; }

    return () => { didCancel = true; };
  }, [constraints, stream, error, onCameraPermissionError, onCameraPermissionSuccess]);

  return { stream, error };
}

export default useUserMedia;
