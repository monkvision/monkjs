import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import createElement from 'react-native-web/dist/exports/createElement';
import PropTypes from 'prop-types';

import { Text, View } from 'react-native';

import { utils, useTimeout } from '@monkvision/toolkit';
import Actions from '../../actions';
import styles from './styles';

import useCamera from './hooks/useCamera';

const isMobile = ['iOS', 'Android'].includes(utils.getOS());
const facingMode = isMobile ? { exact: 'environment' } : 'environment';
const canvasResolution = { QHD: { width: 2560, height: 1440 }, FHD: { width: 1920, height: 1080 } };
const Video = React.forwardRef((props, ref) => createElement('video', { ...props, ref }));

const getLandscapeScreenDimensions = () => {
  const { width, height } = window.screen;
  return { height: Math.min(width, height), width: Math.max(width, height) };
};

function Camera({
  children,
  containerStyle,
  onCameraReady,
  title,
  settings,
  enableQHDWhenSupported,
}, ref) {
  const [resolution, setResolution] = useMemo(() => {
    const cameraResolution = canvasResolution[settings.state.resolution]; // FHD or QHD
    const updateResolution = (r) => settings.dispatch({
      type: Actions.settings.UPDATE_SETTINGS,
      payload: { resolution: r },
    });

    return [cameraResolution, updateResolution];
  }, [settings]);

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
  const delay = useMemo(
    () => (enableQHDWhenSupported && stream && videoRef.current ? 500 : null),
    [stream],
  );

  // stopping the stream when the component unmount
  useEffect(() => stopStream, [stopStream]);

  useTimeout(() => {
    const supportsQHD = utils.inaccuratelyCheckQHDSupport(takePicture);
    if (supportsQHD) { setResolution('QHD'); } else { setResolution('FHD'); }
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
  enableQHDWhenSupported: PropTypes.bool,
  onCameraReady: PropTypes.func.isRequired,
  settings: PropTypes.shape({
    dispatch: PropTypes.func,
    state: PropTypes.shape({ resolution: PropTypes.string }),
  }),
  title: PropTypes.string,
};

Camera.defaultProps = {
  containerStyle: null,
  enableQHDWhenSupported: true,
  settings: { state: { resolution: 'FHD' }, dispatch: () => {} },
  title: '',
};
