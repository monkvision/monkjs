import { useCallback, useEffect, useRef, useState } from 'react';
import { CameraConfig } from '../Camera.types';
import { getMediaConstraints, applyFocusConstraints } from './utils/getMediaContraints';

export interface UserMediaResult {
  stream: MediaStream | null;
  error: unknown;
  retry: () => void;
}

export function useUserMedia(config: CameraConfig, videoRef: React.RefObject<HTMLVideoElement>): UserMediaResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<unknown>(null);
  const retryCountRef = useRef(0);

  const getUserMedia = useCallback(async () => {
    try {
      const constraints = getMediaConstraints(config);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      // Apply continuous autofocus after stream is obtained (silently ignored if unsupported)
      await applyFocusConstraints(mediaStream);
      setStream(mediaStream);
      setError(null);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(err);
      setStream(null);
    }
  }, [config, videoRef]);

  const retry = useCallback(() => {
    retryCountRef.current += 1;
    getUserMedia();
  }, [getUserMedia]);

  useEffect(() => {
    getUserMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { stream, error, retry };
}
