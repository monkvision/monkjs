import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { View, StyleSheet } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import utils from '../utils';
import useCameraAsync from '../../hooks/useCameraAsync';

/**
 * A View using Camera native features
 *
 * @param children {node}
 * @param onCameraReady {func}
 * @param onCameraRef {func}
 * @param ratio {string}
 * @returns {JSX.Element}
 * @constructor
 *
 */
function Camera({
  children,
  onCameraReady,
  onCameraRef,
  ratio,
}) {
  // STATE
  const [camera, setCamera] = useState();
  const { hasPermission, isAvailable } = useCameraAsync(camera);
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
  if (!isAvailable || !hasPermission) {
    return <View />;
  }
  return (
    <ExpoCamera
      onCameraReady={handleCameraReady}
      ref={handleCameraRef}
      ratio={ratio}
      style={cameraStyle.root}
      type={ExpoCamera.Constants.Type.back}
    >
      {children}
    </ExpoCamera>
  );
}

Camera.propTypes = {
  children: PropTypes.node,
  onCameraReady: PropTypes.func,
  onCameraRef: PropTypes.func,
  ratio: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  onCameraReady: noop,
  onCameraRef: noop,
  ratio: '4:3',
};

export default Camera;
