import React, { useCallback, useState } from 'react';
import { Platform, StatusBar, View, StyleSheet } from 'react-native';

import { Camera as ExpoCamera } from 'expo-camera';

import PropTypes from 'prop-types';

import useCameraAsync from '../../hooks/useCameraAsync';
import noop from '../../functions/noop';
import isEmpty from '../../functions/isEmpty';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  leftElements: {
    ...Platform.select({
      native: { width: 75 },
      default: { width: 100 },
    }),
  },
  rightElements: {
    position: 'relative',
    ...Platform.select({
      native: { flexGrow: 1 },
    }),
  },
});

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
    <View style={styles.root}>
      <StatusBar hidden />
      <View style={styles.leftElements}>
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
      <View style={styles.rightElements}>
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
