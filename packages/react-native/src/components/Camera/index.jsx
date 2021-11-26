import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { View, Platform, StyleSheet } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import utils from '../utils';
import useCameraAsync from '../../hooks/useCameraAsync';

/**
 * A View using Camera native features
 *
 * @param onCameraReady {func}
 * @param onCameraRef {func}
 * @param ratio {string}
 * @param lockOrientationOnRendner {bool}
 * @returns {JSX.Element}
 * @constructor
 *
 */
function Camera({
  onCameraReady,
  onCameraRef,
  ratio,
  lockOrientationOnRendner,
}) {
  // STATE
  const [camera, setCamera] = useState();
  const [cameraCanMount] = useCameraAsync({ lockOrientationOnRendner });

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
  lockOrientationOnRendner: PropTypes.bool,
  onCameraReady: PropTypes.func,
  onCameraRef: PropTypes.func,
  ratio: PropTypes.string,
};

Camera.defaultProps = {
  onCameraReady: noop,
  onCameraRef: noop,
  ratio: '4:3',
  lockOrientationOnRendner: true,
};

export default Camera;
