import { useEffect, useRef } from 'react';
import { utils } from '@monkvision/toolkit';

import useUserMedia from './useUserMedia';

/**
 * Note(Ilyass): As long as I tested, the dimensions of the `drawImage` methode, should always be
 * less than the dimensions provided to the canvas itself and to the video constraints.
 * As a workaround I added a value of 0.2px to the dimensions of the canvas and to the
 * video constraints (1 was the smaller working value, smaller values crashes the camera).
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

    // canvas's resolution: 2561x1441
    const canvas = document.createElement('canvas');

    // croppedCanvas's resolution: 2560x1440
    const croppedCanvas = document.createElement('canvas');

    canvas.width = width + diff;
    canvas.height = height + diff;

    croppedCanvas.width = width;
    croppedCanvas.height = height;

    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, width, height);
    croppedCanvas.getContext('2d').drawImage(canvas, 0, 0, width, height);

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
