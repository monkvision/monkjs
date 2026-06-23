import { useCallback, useEffect, useRef, useState } from 'react';
import { CameraFacingMode, CameraResolution } from '../../Camera.types';
import { applyFocusConstraints, getMediaConstraints } from './utils/getMediaContraints';

export interface UseUserMediaParams {
  resolution: CameraResolution;
  facingMode: CameraFacingMode;
  deviceId?: string;
}

export interface UseUserMediaResult {
  stream: MediaStream | null;
  error: Error | null;
  retry: () => void;
}

export function useUserMedia({
  resolution,
  facingMode,
  deviceId,
}: UseUserMediaParams): UseUserMediaResult {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);

  const startStream = useCallback(async () => {
    // Stop any existing tracks before starting a new stream
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }

    try {
      const constraints = getMediaConstraints({ resolution, facingMode });
      if (deviceId && constraints.video && typeof constraints.video === 'object') {
        (constraints.video as MediaTrackConstraints).deviceId = { exact: deviceId };
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Apply focus constraints after stream is obtained — some browsers only accept
      // advanced constraints post-getUserMedia, not at request time.
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        // Fire-and-forget: focus improvement is best-effort, never blocks the stream
        applyFocusConstraints(videoTrack).catch(() => {});
      }

      setStream(mediaStream);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setStream(null);
    }
  }, [resolution, facingMode, deviceId, retryCountRef.current]);

  useEffect(() => {
    startStream();
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [resolution, facingMode, deviceId, retryCountRef.current]);

  const retry = useCallback(() => {
    retryCountRef.current += 1;
    setError(null);
  }, []);

  return { stream, error, retry };
}
