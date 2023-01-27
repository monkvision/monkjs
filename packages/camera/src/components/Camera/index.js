import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import createElement from 'react-native-web/dist/exports/createElement';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { utils, useTimeout } from '@monkvision/toolkit';

import Actions from '../../actions';
import Constants from '../../const';

import styles from './styles';
import useCamera from './hooks/useCamera';

const isMobile = ['iOS', 'Android'].includes(utils.getOS());
const facingMode = isMobile ? { exact: 'environment' } : 'environment';
const Video = React.forwardRef((props, ref) => createElement('video', { ...props, ref }));

const getLandscapeScreenDimensions = () => {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  return { height: Math.min(width, height), width: Math.max(width, height) };
};

function Camera({
  children,
  containerStyle,
  onCameraReady,
  settings,
  enableQHDWhenSupported,
  onWarningMessage,
  resolutionOptions,
  compressionOptions,
  onCameraPermissionError,
  onCameraPermissionSuccess,
  isDisplayed,
}, ref) {
  const [resolution, setResolution] = useMemo(() => {
    const cameraResolution = Constants.resolution[settings.state.resolution];
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
  } = useCamera({
    resolution,
    enableCompression: settings.state.compression,
    compressionOptions,
    video: { facingMode, width: resolution.width, height: resolution.height },
    onCameraReady,
    onCameraPermissionError,
    onCameraPermissionSuccess,
    onWarningMessage,
  });

  useImperativeHandle(ref, () => ({ takePicture, resumePreview, pausePreview, stream }));
  const delay = useMemo(
    () => (enableQHDWhenSupported && stream && videoRef.current
      ? resolutionOptions?.QHDDelay ?? 500 : null),
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
      style={[styles.container, containerStyle, isDisplayed ? null : { display: 'none' }]}
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
    </View>
  );
}

export default forwardRef(Camera);

Camera.propTypes = {
  compressionOptions: PropTypes.shape({
    quality: PropTypes.number,
  }),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  enableQHDWhenSupported: PropTypes.bool,
  isDisplayed: PropTypes.bool,
  onCameraPermissionError: PropTypes.func,
  onCameraPermissionSuccess: PropTypes.func,
  onCameraReady: PropTypes.func.isRequired,
  onWarningMessage: PropTypes.func,
  resolutionOptions: PropTypes.shape({
    QHDDelay: PropTypes.number,
  }),
  settings: PropTypes.shape({
    dispatch: PropTypes.func,
    state: PropTypes.shape({
      compression: PropTypes.bool,
      resolution: PropTypes.string,
    }),
  }),
};

Camera.defaultProps = {
  compressionOptions: undefined,
  containerStyle: null,
  enableQHDWhenSupported: true,
  isDisplayed: true,
  onCameraPermissionError: () => {},
  onCameraPermissionSuccess: () => {},
  onWarningMessage: () => {},
  resolutionOptions: undefined,
  settings: { state: { resolution: 'FHD' }, dispatch: () => {} },
};
