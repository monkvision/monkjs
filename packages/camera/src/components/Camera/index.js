import React, { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import createElement from 'react-native-web/dist/exports/createElement';
import PropTypes from 'prop-types';

import { Text, useWindowDimensions, View } from 'react-native';
import { utils } from '@monkvision/toolkit';

import { findDevices, findBestCandidate, setVideoSource } from './utils';
import getOS from '../../utils/getOS';
import styles from './styles';

const { getSize } = utils.styles;

const Video = React.forwardRef(
  (props, ref) => createElement(
    'video',
    { ...props, ref },
  ),
);

const Camera = ({ children, containerStyle, onCameraReady, title }, ref) => {
  const videoRef = useRef();
  const expoCameraRef = useRef();
  const windowDimensions = useWindowDimensions();

  const [camera, setCamera] = useState({
    stream: null,
    width: 0,
    height: 0,
    ratio: '4:3',
    pictureSize: '',
  });

  const [loading, setLoading] = useState(false);

  const videoSize = useMemo(
    () => getSize(camera.ratio, windowDimensions, 'number'),
    [camera, windowDimensions],
  );

  useImperativeHandle(ref, () => ({
    async takePicture() {
      if (!videoRef.current) { throw new Error('Camera is not ready!'); }
      const { width, height, stream } = camera;

      if (ImageCapture && getOS() !== 'ios') {
        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);

        const blob = await imageCapture.takePhoto({
          imageWidth: width,
          imageHeight: height,
        });

        const uri = URL.createObjectURL(blob);

        return { uri };
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      canvas.getContext('2d')
        .drawImage(videoRef.current, 0, 0, width, height);

      const imageType = utils.getOS() === 'ios' ? 'image/png' : 'image/webp';
      const uri = canvas.toDataURL(imageType);

      return { uri };
    },
    async resumePreview() {
      if (videoRef.current) {
        videoRef.current.play();
      }
    },
    async pausePreview() {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
  }),
  [camera]);

  useLayoutEffect(() => {
    (async () => {
      if (videoRef && !camera.stream && !loading) {
        setLoading(true);

        const devices = await findDevices();
        const bestCandidate = await findBestCandidate(devices);

        setVideoSource(videoRef.current, bestCandidate.stream);

        setCamera(bestCandidate);
        setLoading(false);

        onCameraReady();
      }
    })();
  }, [camera, loading, onCameraReady, videoRef]);

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
        ref={videoRef}
        {...videoSize}
      />
      {children}
      <Text style={styles.title}>{title}</Text>
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
