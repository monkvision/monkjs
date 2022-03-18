import React, { useCallback, useEffect, useRef, useState } from 'react';
import adapter from 'webrtc-adapter';
import PropTypes from 'prop-types';

import { Text, useWindowDimensions, View } from 'react-native';
import { utils } from '@monkvision/toolkit';

import styles from './styles';

const { getSize } = utils.styles;

const tests = [{
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

const { getUserMedia } = navigator.mediaDevices || navigator.mozGetUserMedia;

export default function Camera({ containerStyle, onRef, title }) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [ratio, setRatio] = useState('4:3');

  const size = getSize(ratio, { windowHeight, windowWidth }, 'number');

  const videoEl = useRef();
  const canvasEl = useRef();
  const [camera, setCamera] = useState({});

  const gum = useCallback(async (test, device) => {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

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
    } catch (error) {
      result = { error };
    }

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
      browserVer: `${adapter.browserDetails.browser} ${adapter.browserDetails.version}`,
      ask: `${test.width}x${test.height}`,
      actual: `${size.width}x${size.height}`,
    };
  }, [gum, size.height, size.width]);

  const findDevices = useCallback(async () => {
    const constraints = {
      audio: false,
      video: { facingMode: 'environment' },
    };

    window.stream = await getUserMedia(constraints);
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();

    return mediaDevices.filter(({ kind }) => kind === 'videoinput');
  }, []);

  useEffect(() => {
    (async () => {
      const video = videoEl.current;
      if (video && !camera.video) {
        const canvas = canvasEl.current;
        const devices = await findDevices();
        const bestCandidate = await findBestCandidate(devices);

        setRatio(bestCandidate.test.ratio);

        if ('srcObject' in video) {
          video.srcObject = bestCandidate.stream;
        } else {
          video.src = window.URL.createObjectURL(bestCandidate.stream);
        }

        video.onloadedmetadata = () => {
          video.play();
        };

        canvas.width = bestCandidate.test.width;
        canvas.height = bestCandidate.test.height;

        const takePictureAsync = () => {
          canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
          return { uri: canvasEl.current.toDataURL('image/webp') };
        };

        setCamera({
          takePictureAsync,
          canvas,
          video,
        });
      }
    })();
  }, [camera, findBestCandidate, findDevices]);

  useEffect(() => {
    if (typeof onRef === 'function') {
      onRef(camera);
    }
  }, [camera, onRef]);

  return (
    <View
      accessibilityLabel="Camera container"
      style={[containerStyle, size]}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        width={size.width}
        height={size.height}
        ref={videoEl}
      />
      <canvas ref={canvasEl} />
      {title !== '' && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

Camera.propTypes = {
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onRef: PropTypes.func.isRequired,
  title: PropTypes.string,
};

Camera.defaultProps = {
  containerStyle: null,
  title: '',
};
