import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { View, Platform, StyleSheet } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import utils from '../utils';
import useCameraAsync from '../../hooks/useCameraAsync';
import useCameraFullscreen from './useCameraFullscreen';

/**
 * A View using Camera native features
 *
 * @param onCameraReady {func}
 * @param onCameraRef {func}
 * @param ratio {number || string}
 * @param lockOrientationOnRender {bool}
 * @param children {elem}
 * @param fullscreen {bool}
 * @returns {JSX.Element}
 * @constructor
 *
 */
const styles = StyleSheet.create({
  cover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

function Camera({
  onCameraReady,
  onCameraRef,
  ratio,
  lockOrientationOnRender,
  children,
  fullscreen,
}) {
  // STATE
  const [camera, setCamera] = useState();
  const [cameraCanMount] = useCameraAsync({ lockOrientationOnRender });

  const {
    cameraStyle: fullscreenCameraStyle,
    contentStyle: fullscreenContentStyle,
  } = useCameraFullscreen(ratio);

  const cameraStyle = useMemo(() => {
    // eslint-disable-next-line import/no-named-as-default-member
    const sizes = utils.styles.getContainedSizes(ratio);
    return StyleSheet.create({ root: { ...sizes } });
  }, [ratio]);

  // CALLBACKS
  const handleCameraRef = useCallback((ref) => {
    setCamera(ref);
    onCameraRef(ref);
  }, [onCameraRef]);

  const handleCameraReady = useCallback(() => {
    onCameraReady(camera);
  }, [camera, onCameraReady]);

  // RENDERERS
  if (Platform.OS === 'web' && utils.getOS() === 'iOS' && !cameraCanMount) {
    return <View />;
  }
  if (fullscreen) {
    return (
      <ExpoCamera
        style={[styles.cover, fullscreenCameraStyle]}
        onCameraReady={handleCameraReady}
        ref={handleCameraRef}
        type={ExpoCamera.Constants.Type.back}
      >
        <View style={[styles.cover, fullscreenContentStyle]}>
          {children}
        </View>
      </ExpoCamera>
    );
  }
  return (
    <ExpoCamera
      onCameraReady={handleCameraReady}
      ref={handleCameraRef}
      ratio={ratio}
      style={cameraStyle.root}
      type={ExpoCamera.Constants.Type.back}
    />
  );
}

Camera.propTypes = {
  children: PropTypes.element,
  fullscreen: PropTypes.bool,
  lockOrientationOnRender: PropTypes.bool,
  onCameraReady: PropTypes.func,
  onCameraRef: PropTypes.func,
  ratio: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  onCameraReady: noop,
  onCameraRef: noop,
  ratio: '4:3',
  lockOrientationOnRender: true,
  fullscreen: false,
};

export default Camera;
