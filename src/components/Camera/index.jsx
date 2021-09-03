import React, { useCallback, useState } from 'react';
import { Platform, StatusBar, View } from 'react-native';

import { Camera as ExpoCamera } from 'expo-camera';

import useCameraAsync from 'controllers/hooks/Camera/useCameraAsync';

import PropTypes from 'prop-types';
import noop from 'functions/noop';
import isEmpty from 'functions/isEmpty';

/**
 * A View using Camera native features
 *
 * @param children {node}
 * @param leftElements {node}
 * @param onCameraRef {func}
 * @param ratio {string}
 * @param rightElements {node}
 * @returns {JSX.Element}
 * @constructor
 *
 */
function Camera({ children, leftElements, onCameraRef, ratio, rightElements }) {
  const [camera, setCamera] = useState();
  const { hasPermission, isAvailable } = useCameraAsync(camera);

  function handleCameraRef(ref) {
    setCamera(ref);
    onCameraRef(ref);
  }

  const getContainedSizes = useCallback((onlyResult = false) => {
    if (isEmpty(ratio)) {
      return {};
    }

    const [a, b] = ratio.split(':').sort((c, d) => (c + d));
    const result = (100 / a) * b;

    if (onlyResult === true) {
      return result;
    }

    return { height: '100%', width: `${(100 / a) * b}%` };
  }, [ratio]);

  if (!isAvailable || !hasPermission) {
    return <View />;
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'nowrap', overflow: 'hidden', backgroundColor: '#000' }}>
      <StatusBar hidden />
      <View style={{ width: 75 }}>
        {leftElements}
      </View>
      <ExpoCamera
        ref={handleCameraRef}
        ratio={ratio}
        style={getContainedSizes()}
        type={ExpoCamera.Constants.Type.back}
      >
        {children}
      </ExpoCamera>
      <View style={{
        position: 'relative',
        ...Platform.select({
          native: {
            flexGrow: 1,
          },
          default: {
            // other platforms, web for example
          },
        }),
      }}
      >
        {rightElements}
      </View>
    </View>
  );
}

Camera.propTypes = {
  children: PropTypes.node,
  leftElements: PropTypes.node,
  onCameraRef: PropTypes.func,
  ratio: PropTypes.string,
  rightElements: PropTypes.node,
};

Camera.defaultProps = {
  children: null,
  leftElements: null,
  onCameraRef: noop,
  ratio: '4:3',
  rightElements: null,
};

export default Camera;
