import { utils } from '@monkvision/toolkit';
import PropTypes from 'prop-types';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Text, useWindowDimensions, View } from 'react-native';
import adapter from 'webrtc-adapter';

import styles from './styles';

const { getSize } = utils.styles;

const tests = [{
  label: '4K(UHD)',
  width: 3840,
  height: 2880,
  ratio: '4:3',
}, {
  label: 'FHD',
  width: 1920,
  height: 1440,
  ratio: '4:3',
},
{
  label: 'UXGA',
  width: 1600,
  height: 1200,
  ratio: '4:3',
},
{
  label: 'SVGA',
  width: 800,
  height: 600,
  ratio: '4:3',
},
{
  label: 'VGA',
  width: 640,
  height: 480,
  ratio: '4:3',
},
{
  label: 'CIF',
  width: 352,
  height: 288,
  ratio: '4:3',
},
{
  label: 'QVGA',
  width: 320,
  height: 240,
  ratio: '4:3',
},
{
  label: 'QCIF',
  width: 176,
  height: 144,
  ratio: '4:3',
},
{
  label: 'QQVGA',
  width: 160,
  height: 120,
  ratio: '4:3',
},

];

export default function Camera({ containerStyle, onRef, title }) {
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const size = getSize(
    '4:3',
    { windowHeight, windowWidth },
    'native',
  );

  const videoEl = useRef();
  const canvasEl = useRef();
  const [camera, setCamera] = useState({});

  const gum = useCallback(async (test, device) => {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    const constraints = {
      audio: false,
      video: {
        facingMode: 'environment',
        deviceId: device.deviceId ? { exact: device.deviceId } : undefined,
        width: { exact: test.width },
        height: { exact: test.height },
      },
    };

    let result;

    try {
      result = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      result = { error };
    }

    return [test, result, constraints];
  }, []);

  const findBestCandidate = useCallback(async (bestDevice) => {
    const testResults = tests.map(async (test) => gum(test, bestDevice));

    const [test, stream, constraint] = await testResults.reduce(async (resultA, resultB) => {
      const [testA, streamA] = await resultA;
      const [testB] = await resultB;

      if (streamA.error) { return resultB; }

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
    const devices = [];
    const constraints = {
      audio: false,
      video: {
        facingMode: 'environment',
        width: { exact: 640 },
        height: { exact: 480 },
      },
    };

    window.stream = await navigator.mediaDevices.getUserMedia(constraints);
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();

    mediaDevices.forEach((device) => {
      if (device.kind === 'videoinput') {
        devices.push(device);
      }
    });

    return devices;
  }, []);

  useEffect(() => {
    (async () => {
      const video = videoEl.current;
      const canvas = canvasEl.current;

      if (video) {
        const devices = await findDevices();
        const bestCandidate = await findBestCandidate(devices[0]);

        video.srcObject = bestCandidate.stream;
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
  }, [findBestCandidate, findDevices]);

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
