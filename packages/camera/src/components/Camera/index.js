import React, { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import createElement from 'react-native-web/dist/exports/createElement';
import adapter from 'webrtc-adapter';
import PropTypes from 'prop-types';

import { Text, useWindowDimensions, View } from 'react-native';
import { utils } from '@monkvision/toolkit';

import styles from './styles';

const { getSize } = utils.styles;

const Video = React.forwardRef((props, ref) => createElement('video', { ...props, ref }));

const tests = [
//   {
//   label: '4K(UHD) 4:3',
//   width: 3840,
//   height: 2880,
//   ratio: '4:3',
// }, {
//   label: '4K(UHD) 16:9',
//   width: 3840,
//   height: 2160,
//   ratio: '16:9',
// },
  {
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

function getUserMedia(constraints) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.

  // First get hold of the legacy getUserMedia, if present
  const get = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || (() => {
      const error = new Error('Permission unimplemented');
      error.code = 0;
      error.name = 'NotAllowedError';
      throw error;
    });

  return new Promise((resolve, reject) => {
    get.call(navigator, constraints, resolve, reject);
  });
}

const Camera = ({ children, containerStyle, onCameraReady, title }, ref) => {
  const windowDimensions = useWindowDimensions();
  const videoEl = useRef();
  const canvasEl = useRef();
  const [candidate, setCandidate] = useState();
  const [loading, setLoading] = useState(false);

  const { width: videoWidth, height: videoHeight } = useMemo(() => {
    if (!candidate) { return { width: 0, height: 0 }; }
    return getSize(candidate.test.ratio, windowDimensions, 'number');
  }, [candidate, windowDimensions]);

  const gum = useCallback(async (test, device) => {
    if (window.stream) { window.stream.getTracks().forEach((track) => track.stop()); }

    const OS = utils.getOS();
    const facingMode = ['iOS', 'Android'].includes(OS) ? { exact: 'environment' } : 'environment';

    const constraints = {
      audio: false,
      video: {
        facingMode,
        deviceId: device.deviceId ? { exact: device.deviceId } : undefined,
        width: { exact: test.width },
        height: { exact: test.height },
      },
    };

    let result;
    try {
      result = await getUserMedia(constraints);
    } catch (error) { result = { error }; }

    return [test, result, constraints, device];
  }, []);

  const findBestCandidate = useCallback(async (devices) => {
    const testResults = devices
      .map((device) => tests.map(async (test) => gum(test, device)))
      .flat();

    const [test, stream, constraint] = await testResults
      .reduce(async (resultA, resultB) => {
        const [testA, streamA] = await resultA;
        const [testB, streamB] = await resultB;

        if (streamA.error) { return resultB; }
        if (streamB.error) { return resultA; }

        return testA.width > testB.width ? resultA : resultB;
      });

    return {
      test,
      stream,
      constraint,
      ask: `${test.width}x${test.height}`,
      browserVer: `${adapter.browserDetails.browser} ${adapter.browserDetails.version}`,
    };
  }, [gum]);

  const findDevices = useCallback(async () => {
    const constraints = { audio: false, video: { facingMode: 'environment' } };
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();
    window.stream = await getUserMedia(constraints);

    return mediaDevices.filter(({ kind }) => kind === 'videoinput');
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      async takePicture() {
        if (!videoEl.current || videoEl.current?.readyState !== videoEl.current?.HAVE_ENOUGH_DATA) {
          throw new Error(
            'ERR_CAMERA_NOT_READY',
            'HTMLVideoElement does not have enough camera data to construct an image yet.',
          );
        }

        canvasEl.current
          .getContext('2d')
          .drawImage(videoEl.current, 0, 0, canvasEl.current.width, canvasEl.current.height);

        const imageType = utils.getOS() === 'ios' ? 'image/png' : 'image/webp';
        const uri = canvasEl.current.toDataURL(imageType);

        return { uri };
      },
      async resumePreview() {
        if (videoEl.current) {
          videoEl.current.play();
        }
      },
      async pausePreview() {
        if (videoEl.current) {
          videoEl.current.pause();
        }
      },
    }),
    [videoEl],
  );

  useLayoutEffect(() => {
    (async () => {
      if (videoEl && !candidate && !loading) {
        const video = videoEl.current;

        setLoading(true);

        const canvas = canvasEl.current;
        const devices = await findDevices();
        const bestCandidate = await findBestCandidate(devices);

        setCandidate(bestCandidate);

        if ('srcObject' in video) {
          video.srcObject = bestCandidate.stream;
          video.play();
        } else {
          video.src = window.URL.createObjectURL(bestCandidate.stream);
        }

        canvas.width = bestCandidate.test.width;
        canvas.height = bestCandidate.test.height;

        video.onloadedmetadata = () => { video.play(); };

        setLoading(false);
        onCameraReady();
      }
    })();
  }, [candidate, findBestCandidate, findDevices, loading, onCameraReady, videoEl]);

  return (
    <View
      pointerEvents="box-none"
      accessibilityLabel="Camera container"
      style={[styles.container, containerStyle]}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <Video
        autoPlay
        playsInline
        ref={videoEl}
        width={videoWidth}
        height={videoHeight}
      />
      <canvas ref={canvasEl} />
      {children}
      {(title !== '' && candidate) && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

export default forwardRef(Camera);

Camera.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onCameraReady: PropTypes.func.isRequired,
  title: PropTypes.string,
};

Camera.defaultProps = {
  containerStyle: null,
  title: '',
};
