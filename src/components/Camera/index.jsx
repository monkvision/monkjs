import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';

import { Camera as ExpoCamera } from 'expo-camera';

import useCameraAsync from 'controllers/hooks/Camera/useCameraAsync';

import PropTypes from 'prop-types';
import noop from 'functions/noop';

/**
 * A View using Camera native features
 *
 * @param children
 * @param onCameraRef
 * @returns {JSX.Element}
 * @constructor
 *
 */
function Camera({ children, onCameraRef }) {
  const [camera, setCamera] = useState();
  const { hasPermission, isAvailable } = useCameraAsync(camera);

  function handleCameraRef(ref) {
    setCamera(ref);
    onCameraRef(ref);
  }

  if (!isAvailable || !hasPermission) {
    return <View />;
  }

  return (
    <View style={{ flex: 1, alignItems: 'flex-end', overflow: 'hidden' }}>
      <StatusBar hidden />
      <ExpoCamera
        ref={handleCameraRef}
        ratio="4:3"
        style={{ width: '75%', height: '100%' }}
        type={ExpoCamera.Constants.Type.back}
      >
        {children}
      </ExpoCamera>
    </View>
  );
}

Camera.propTypes = {
  children: PropTypes.node,
  onCameraRef: PropTypes.func,
};

Camera.defaultProps = {
  children: null,
  onCameraRef: noop,
};

export default Camera;
