import { useCallback, useEffect, useRef, useState } from 'react';
import { CameraConfig } from '../Camera.types';
import { applyFocusConstraints, getMediaConstraints } from './utils/getMediaContraints';

export interface UserMediaResult {
  stream: MediaStream | null;
  error: Error | null;
  retry: () => void;
}

export function useUserMedia(config: CameraConfig, videoRef: React.RefObject<HTMLVideoElement>): UserMediaResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);

  const startStream = useCallback(async () => {
    // Stop any existing tracks before starting a new stream
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    try {
      const constraints = getMediaConstraints(config);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Apply continuous autofocus on the video track (best-effort, iOS < 17 silently ignores)
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        await applyFocusConstraints(videoTrack);
      }

      setStream(mediaStream);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setStream(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, retryCountRef]);

  useEffect(() => {
    void startStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCountRef.current]);

  const retry = useCallback(() => {
    retryCountRef.current += 1;
  }, []);

  return { stream, error, retry };
}
