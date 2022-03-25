import 'webrtc-adapter';
import { utils } from '@monkvision/toolkit';

export const whitelist = [{
  label: '4K(UHD) 4:3',
  width: 3840,
  height: 2880,
  ratio: '4:3',
}, {
  label: '4K(UHD) 16:9',
  width: 3840,
  height: 2160,
  ratio: '16:9',
}, {
  label: 'FHD 4:3',
  width: 1920,
  height: 1440,
  ratio: '4:3',
}, {
  label: 'FHD 16:9',
  width: 1920,
  height: 1080,
  ratio: '16:9',
}, {
  label: 'UXGA',
  width: 1600,
  height: 1200,
  ratio: '4:3',
}, {
  label: 'HD(720p)',
  width: 1280,
  height: 720,
  ratio: '16:9',
}, {
  label: 'SVGA',
  width: 800,
  height: 600,
  ratio: '4:3',
}, {
  label: 'VGA',
  width: 640,
  height: 480,
  ratio: '4:3',
}, {
  label: 'CIF',
  width: 352,
  height: 288,
  ratio: '4:3',
}, {
  label: 'QVGA',
  width: 320,
  height: 240,
  ratio: '4:3',
}, {
  label: 'QCIF',
  width: 176,
  height: 144,
  ratio: '4:3',
}, {
  label: 'QQVGA',
  width: 160,
  height: 120,
  ratio: '4:3',
}];

export function captureImageContext(video, { width, height }) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: false });

  if (!context) {
    throw new Error('Context is not defined');
  }

  context.drawImage(video, 0, 0, width, height);

  return canvas;
}

export function getUserMedia(constraints) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.

  // First get hold of the legacy getUserMedia, if present
  const gum = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || (() => {
      const error = new Error('Permission unimplemented');
      error.code = 0;
      error.name = 'NotAllowedError';
      throw error;
    });

  return new Promise((resolve, reject) => {
    gum.call(navigator, constraints, resolve, reject);
  });
}

export async function testUserMedia(details, device) {
  if (window.stream) { window.stream.getTracks().forEach((track) => track.stop()); }

  const OS = utils.getOS();
  const facingMode = ['iOS', 'Android'].includes(OS) ? { exact: 'environment' } : 'environment';

  const constraints = {
    audio: false,
    video: {
      facingMode,
      deviceId: device.deviceId ? { exact: device.deviceId } : undefined,
      width: { exact: details.width },
      height: { exact: details.height },
    },
  };

  const response = {
    ...details,
    device,
    constraints,
    stream: null,
    error: false,
    pictureSize: `${details.width}x${details.height}`,
  };

  try {
    response.stream = await getUserMedia(constraints);
  } catch (e) { response.error = e; }

  return response;
}

export async function findBestCandidate(devices) {
  return devices
    .map((device) => whitelist.map(async (details) => testUserMedia(details, device)))
    .flat()
    .reduce(async (resultA, resultB) => {
      const { width: wA, error: eA } = await resultA;
      const { width: wB, error: eB } = await resultB;

      if (eA !== false) { return resultB; }
      if (eB !== false) { return resultA; }

      return wA > wB ? resultA : resultB;
    });
}

export async function findDevices() {
  const constraints = { audio: false, video: { facingMode: 'environment' } };
  const mediaDevices = await navigator.mediaDevices.enumerateDevices();
  window.stream = await getUserMedia(constraints);

  return mediaDevices.filter(({ kind }) => kind === 'videoinput');
}

export function setVideoSource(video, stream) {
  const createObjectURL = window.URL.createObjectURL ?? window.webkitURL.createObjectURL;

  if (typeof video.srcObject !== 'undefined') {
    // eslint-disable-next-line no-param-reassign
    video.srcObject = stream;
  } else if (typeof video.mozSrcObject !== 'undefined') {
    // eslint-disable-next-line no-param-reassign
    video.mozSrcObject = stream;
  } else if (stream && createObjectURL) {
    // eslint-disable-next-line no-param-reassign
    video.src = createObjectURL(stream);
  }

  if (!stream) {
    const revokeObjectURL = window.URL.revokeObjectURL ?? window.webkitURL.revokeObjectURL;
    const source = video.src ?? video.srcObject ?? video.mozSrcObject;
    if (revokeObjectURL && typeof source === 'string') {
      revokeObjectURL(source);
    }
  }

  // eslint-disable-next-line no-param-reassign
  video.onloadedmetadata = () => { video.play(); };
}

export function isWebKit() {
  return /WebKit/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
}
