import { useEffect, useRef } from 'react';
import { utils } from '@monkvision/toolkit';

import useUserMedia from './useUserMedia';

/**
 * Note(Ilyass): As long as I tested, when we use a canvas (which called `baseCanvas`) and a video
 * constraints of 2560x1440 resolution, the app crashes, and as a solution I increased the
 * `baseCanvas` and the video constraints resolution to 2561x1441 and created another canvas called
 * `croppedCanvas` based on `baseCanvas` (not based on the `video.current`) which
 * will hold a resolution of 2560x1440, so that now we can draw images from it, without any issue.
 */
const diff = 1;

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

  const takePicture = async () => {
    if (!videoRef.current || !stream) { throw new Error('Camera is not ready!'); }

    // baseCanvas's resolution: 2561x1441
    const baseCanvas = document.createElement('canvas');

    // croppedCanvas's resolution: 2560x1440
    const croppedCanvas = document.createElement('canvas');

    baseCanvas.width = width + diff;
    baseCanvas.height = height + diff;

    croppedCanvas.width = width;
    croppedCanvas.height = height;

    baseCanvas.getContext('2d').drawImage(videoRef.current, 0, 0, width, height);
    croppedCanvas.getContext('2d').drawImage(baseCanvas, 0, 0, width, height);

    const imageType = utils.getOS() === 'iOS' ? 'image/png' : 'image/webp';
    const uri = croppedCanvas.toDataURL(imageType);

    return { uri };
  };

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

  return { videoRef, takePicture, resumePreview, pausePreview };
}
