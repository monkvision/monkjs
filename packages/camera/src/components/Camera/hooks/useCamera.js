import { useCallback, useEffect, useRef } from 'react';
import { utils } from '@monkvision/toolkit';

import useUserMedia from './useUserMedia';

// get url from canvas blob, because `canvas.toDataUrl` can't be revoked programmatically
const toBlob = (canvasElement, type, quality = 1) => new Promise((resolve) => {
  canvasElement.toBlob((blob) => resolve(URL.createObjectURL(blob)), type, quality);
});

/**
 * Note(Ilyass): As a solution I increased the `baseCanvas` and the video constraints resolution
 * to `2561x1441` and created another canvas called `croppedCanvas` which will be taking picture
 * based on `baseCanvas` (not on the `video.current`) while holding a resolution of
 * `2560x1440`, that why we added the `diff`.
 */
const diff = 1;
const baseCanvas = document.createElement('canvas');
const croppedCanvas = document.createElement('canvas');
const imageType = utils.supportsWebP ? 'image/webp' : 'image/png';

/**
 * `useCamera` is a hook that takes the `canvasResolution` which holds the dimensions of the canvas,
 *  and an object `options`, containing getUserMedia constraints and `onCameraReady`.
 */
export default function useCamera({ width, height }, options) {
  const { video, onCameraReady } = options;

  const videoConstraints = { ...video, width: video.width + diff, height: video.height + diff };
  const { stream, error } = useUserMedia({ video: videoConstraints });

  const videoRef = useRef(null);

  useEffect(() => {
    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        onCameraReady();
      };
    }
  }, [stream, error]);

  // we can set the canvas dimensions one time rather than on every time we press capture
  useEffect(() => {
    baseCanvas.width = width + diff;
    baseCanvas.height = height + diff;

    croppedCanvas.width = width;
    croppedCanvas.height = height;
  }, [width, height]);

  const takePicture = useCallback(async () => {
    if (!videoRef.current || !stream) { throw new Error('Camera is not ready!'); }

    baseCanvas.getContext('2d').drawImage(videoRef.current, 0, 0, width, height);
    croppedCanvas.getContext('2d').drawImage(baseCanvas, 0, 0, width, height);

    const uri = await toBlob(croppedCanvas, imageType);

    return { uri };
  }, [width, height, stream]);

  const resumePreview = async () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };
  const pausePreview = async () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };
  const stopStream = useCallback(() => {
    if (stream?.getTracks) { stream.getTracks().forEach((track) => track.stop()); return; }
    if (stream?.stop) { stream.stop(); }
  }, [stream]);

  return { videoRef, takePicture, resumePreview, pausePreview, stopStream, stream };
}
