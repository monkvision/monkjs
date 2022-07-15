import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

import { useError, utils } from '@monkvision/toolkit';

import useUserMedia from './useUserMedia';
import useCompression from './useCompression';
import log from '../../../utils/log';

// get url from canvas blob, because `canvas.toDataUrl` can't be revoked programmatically
const toBlob = (canvasElement, type) => new Promise((resolve) => {
  canvasElement.toBlob((blob) => resolve(URL.createObjectURL(blob)), type, 1);
});

/**
 * Note(Ilyass): As a solution we are using a video constraints of width/height + `diff`
 * and a canvas of width/height.
 */
const diff = 1;
const canvas = document.createElement('canvas');
const imageType = utils.supportsWebP ? 'image/webp' : 'image/png';

/**
 * `useCamera` is a hook that takes the `canvasResolution` which holds the dimensions of the canvas,
 *  and an object `options`, containing getUserMedia constraints and `onCameraReady`.
 */
export default function useCamera(
  { width, height },
  options,
  enableCompression,
  Sentry,
  onWarningMessage,
) {
  const { video, onCameraReady } = options;
  const { Span } = useError(Sentry);
  const compress = useCompression();

  const videoConstraints = { ...video, width: video.width + diff, height: video.height + diff };
  const { stream, error } = useUserMedia({ video: videoConstraints });

  const videoRef = useRef(null);

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => { videoRef.current.play(); onCameraReady(); };
    }
  }, [stream, error]);

  // we can set the canvas dimensions one time rather than on every time we press capture
  useEffect(() => { canvas.width = width; canvas.height = height; }, [width, height]);

  const takePicture = useCallback(async () => {
    if (!videoRef.current || !stream) { throw new Error('Camera is not ready!'); }

    let webCaptureTracing;
    if (Sentry) { webCaptureTracing = new Span('web-capture', 'func'); }
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, width, height);

    let uri;
    if (enableCompression && !utils.supportsWebP()) {
      log(['[Event] Compressing an image']);
      if (Platform.OS !== 'web') { return undefined; }
      const arrayBuffer = canvas.getContext('2d').getImageData(0, 0, width, height).data;

      let compressionTracing;
      if (Span) { compressionTracing = new Span('image-compression', 'func'); }

      if (onWarningMessage) { onWarningMessage('Compressing an image...'); }
      const compressed = await compress(arrayBuffer, width, height);
      if (onWarningMessage) { onWarningMessage(null); }

      if (compressed) {
        log([`[Event] An image has been taken, with size: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}Mo, optimized to ${(compressed.size / 1024 / 1024).toFixed(2)}Mo, and resolution: ${width}x${height}`]);
      }

      compressionTracing?.finish();
      uri = URL.createObjectURL(compressed);
    } else {
      uri = await toBlob(canvas, imageType);
    }

    webCaptureTracing?.finish();

    return { uri, width, height };
  }, [width, height, stream]);

  const resumePreview = async () => {
    if (videoRef.current) { videoRef.current.play(); }
  };
  const pausePreview = async () => {
    if (videoRef.current) { videoRef.current.pause(); }
  };
  const stopStream = useCallback(() => {
    if (stream?.getTracks) { stream.getTracks().forEach((track) => track.stop()); return; }
    if (stream?.stop) { stream.stop(); }
  }, [stream]);

  return { videoRef, takePicture, resumePreview, pausePreview, stopStream, stream };
}
