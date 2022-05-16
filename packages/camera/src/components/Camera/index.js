import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import createElement from 'react-native-web/dist/exports/createElement';
import PropTypes from 'prop-types';

import { Text, View } from 'react-native';

import { utils, useTimeout } from '@monkvision/toolkit';
import styles from './styles';

import useCamera from './hooks/useCamera';

const MARK_START = 'mark_start';
const MARK_END = 'mark_end';
const MAX_DURATION_FOR_FHD_PICTURE = 250; // in ms

const isMobile = ['iOS', 'Android'].includes(utils.getOS());
const facingMode = isMobile ? { exact: 'environment' } : 'environment';
const canvasResolution = { qhd: { width: 2560, height: 1440 }, fhd: { width: 1920, height: 1440 } };
const Video = React.forwardRef((props, ref) => createElement('video', { ...props, ref }));

const getLandscapeScreenDimensions = () => {
  const { width, height } = window.screen;
  return { height: Math.min(width, height), width: Math.max(width, height) };
};

function Camera({ children, containerStyle, onCameraReady, title }, ref) {
  const [resolution, setResolution] = useState(canvasResolution.fhd);
  const {
    videoRef,
    takePicture,
    resumePreview,
    pausePreview,
    stopStream,
    stream,
  } = useCamera(resolution, {
    onCameraReady,
    video: { facingMode, width: resolution.width, height: resolution.height },
  });

  useImperativeHandle(ref, () => ({ takePicture, resumePreview, pausePreview, stream }));
  const delay = useMemo(() => (stream && videoRef.current ? 500 : null), [stream]);

  // stopping the stream when the component unmount
  useEffect(() => stopStream, [stopStream]);

  /** Note(Ilyass): As a solution to measure the device performance, we run a dummy `takePicture()`
   * using FHD (to calculate the exec time without crashing the app), and we compare the execution
   * time we get with `MAX_DURATION_FOR_FHD_PICTURE` which is the max duration for `takePicture()`
   * to be taken by a device that can run QHD.
   */
  useTimeout(() => {
    performance.mark(MARK_START);
    const picture = takePicture(); URL.revokeObjectURL(picture.uri);
    performance.mark(MARK_END);

    const { duration } = performance.measure('Measuring `takePicture()` exection time', MARK_START, MARK_END);

    if (duration < MAX_DURATION_FOR_FHD_PICTURE) {
      setResolution(canvasResolution.qhd);
    } else { setResolution(canvasResolution.fhd); }
  }, delay);

  return (
    <View
      pointerEvents="box-none"
      accessibilityLabel="Camera container"
      style={[styles.container, containerStyle]}
    >

      <Video
        autoPlay
        playsInline
        ref={videoRef}
        width={getLandscapeScreenDimensions().width}
        height={getLandscapeScreenDimensions().height}
        controls={false}
      />

      {children}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

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
