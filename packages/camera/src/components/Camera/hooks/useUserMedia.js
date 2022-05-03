import { useState, useEffect } from 'react';

/**
 * `useUserMedia` is a hook that takes an objects constraints, and returns an object
 * of `stream` and `error`.
 */
function useUserMedia(constraints = { audio: false, video: false }) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (stream) { return; }

    let didCancel = false;

    const getUserMedia = async () => {
      try {
        const str = await navigator.mediaDevices.getUserMedia(constraints);
        if (!didCancel) { setStream(str); }
      } catch (err) {
        if (!didCancel) { setError(err); }
      }
    };

    getUserMedia();
    // eslint-disable-next-line consistent-return
    return () => {
      didCancel = true;

      if (!stream) { return; }

      if (stream.getVideoTracks) { stream.getVideoTracks().map((track) => track.stop()); }

      if (stream.getAudioTracks) { stream.getAudioTracks().map((track) => track.stop()); }

      if (stream.stop) { stream.stop(); }
    };
  }, [constraints, stream, error]);

  return { stream, error };
}

export default useUserMedia;
