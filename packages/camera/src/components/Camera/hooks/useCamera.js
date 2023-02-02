import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Platform } from 'react-native';

import { utils } from '@monkvision/toolkit';

import useUserMedia from './useUserMedia';
import useCompression from './useCompression';
import log from '../../../utils/log';

/**
 * Note(Ilyass): As a solution we are using a video constraints of width/height + `diff`
 * and a canvas of width/height.
 */
const diff = 1;
const imageType = utils.supportsWebP ? 'image/webp' : 'image/jpeg';
const imageFilenameExtension = imageType.substring('image/'.length);

/**
 * `useCamera` is a hook that takes the `canvasResolution` which holds the dimensions of the canvas,
 *  and an object `options`, containing getUserMedia constraints and `onCameraReady`.
 */
export default function useCamera({
  resolution,
  enableCompression,
  compressionOptions,
  video,
  onCameraReady,
  onCameraPermissionError,
  onCameraPermissionSuccess,
  onWarningMessage,
}) {
  const { width, height } = resolution;
  const compress = useCompression();

  const videoConstraints = { ...video, width: video.width + diff, height: video.height + diff };
  const { stream, error } = useUserMedia({
    constraints: { video: videoConstraints },
    onCameraPermissionError,
    onCameraPermissionSuccess,
  });

  const videoRef = useRef(null);

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => { videoRef.current.play(); onCameraReady(); };
    }
  }, [stream, error]);

  const canvasResolution = useMemo(() => {
    let calculationRatio = 1;
    let canvasWidth = width;
    let canvasHeight = height;

    if (videoRef.current && videoRef.current?.videoWidth && videoRef.current?.videoHeight) {
      const { videoWidth, videoHeight } = videoRef.current;
      const videoAspectRatio = (videoWidth / videoHeight).toFixed(2);
      const canvasAspectRatio = (width / height).toFixed(2);

      if (videoAspectRatio !== canvasAspectRatio) {
        const widthRatio = width / videoWidth;
        const heightRatio = height / videoHeight;
        calculationRatio = (widthRatio < heightRatio) ? widthRatio : heightRatio;
        canvasWidth = Math.ceil(videoWidth * calculationRatio);
        canvasHeight = Math.ceil(videoHeight * calculationRatio);
      }
    }

    return { canvasWidth, canvasHeight };
  }, [width, height, stream]);

  const takePicture = useCallback(async () => {
    if (!videoRef.current || !stream) { throw new Error('Camera is not ready!'); }

    // create and use the separate canvas for each sight pic
    const canvas = document.createElement('canvas');
    const { canvasWidth, canvasHeight } = canvasResolution;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.getContext('2d', { alpha: false }).drawImage(videoRef.current, 0, 0, canvasWidth, canvasHeight);

    let uri;
    if (enableCompression && !utils.supportsWebP()) {
      log(['[Event] Compressing an image']);
      if (Platform.OS !== 'web') { return undefined; }
      const arrayBuffer = canvas.getContext('2d').getImageData(0, 0, canvasWidth, canvasHeight).data;

      if (onWarningMessage) { onWarningMessage('Compressing an image...'); }
      const compressed = await compress(arrayBuffer, canvasWidth, canvasHeight, compressionOptions);
      if (onWarningMessage) { onWarningMessage(null); }

      if (compressed) {
        log([`[Event] An image has been taken, with size: ${(arrayBuffer.byteLength / 1024 / 1024).toFixed(2)}Mo, optimized to ${(compressed.size / 1024 / 1024).toFixed(2)}Mo, and resolution: ${canvasWidth}x${canvasHeight}`]);
      }

      uri = URL.createObjectURL(compressed);
    } else {
      uri = canvas.toDataURL(imageType);
    }

    return { uri, canvasWidth, canvasHeight, imageType, imageFilenameExtension };
  }, [canvasResolution, stream]);

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
