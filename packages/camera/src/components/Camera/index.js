import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import createElement from 'react-native-web/dist/exports/createElement';
import PropTypes from 'prop-types';

import { Text, View } from 'react-native';

import { utils } from '@monkvision/toolkit';
import styles from './styles';

import useCamera from './hooks/useCamera';

const isMobile = ['iOS', 'Android'].includes(utils.getOS());
const facingMode = isMobile ? { exact: 'environment' } : 'environment';
const canvasResolution = { width: 2560, height: 1440 };

const Video = React.forwardRef((props, ref) => createElement('video', { ...props, ref }));

const getLandscapeScreenDimensions = () => {
  const { width, height } = window.screen;
  return { height: Math.min(width, height), width: Math.max(width, height) };
};

function Camera({ children, containerStyle, onCameraReady, title }, ref) {
  const {
    videoRef,
    takePicture,
    resumePreview,
    pausePreview,
    stopStream,
    stream,
  } = useCamera(canvasResolution, {
    onCameraReady,
    video: { facingMode, width: canvasResolution.width, height: canvasResolution.height },
  });

  useImperativeHandle(ref, () => ({ takePicture, resumePreview, pausePreview, stream }));

  // stopping the stream when the component unmount
  useEffect(() => stopStream, [stopStream]);

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
