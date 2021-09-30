import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import { Platform, StatusBar, View, StyleSheet } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import noop from 'lodash.noop';
import isEmpty from 'lodash.isempty';

import useCameraAsync from '../../hooks/useCameraAsync';
import CameraSideBar from '../CameraSideBar';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'space-between',
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flex: 1 },
    }),
  },
  blackScreen: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
});

function getContainedSize(ratio, onlyResult = false) {
  if (isEmpty(ratio)) { return {}; }
  const [a, b] = ratio.split(':').sort((c, d) => (c + d));

  const result = (100 / a) * b;
  return onlyResult ? result : { height: '100%', width: `${result}%` };
}

/**
 * A View using Camera native features
 *
 * @param children {node}
 * @param left {func}
 * @param onCameraReady {func}
 * @param onCameraRef {func}
 * @param ratio {string}
 * @param right {func}
 * @param showBlackScreen {bool}
 * @param sideBarProps {object}
 * @returns {JSX.Element}
 * @constructor
 *
 */
function Camera({
  children,
  left: Left,
  onCameraReady,
  onCameraRef,
  ratio,
  right,
  showBlackScreen,
  sideBarProps,
}) {
  // STATE
  const [camera, setCamera] = useState();
  const [ready, setReady] = useState();

  const { hasPermission, isAvailable } = useCameraAsync(camera);

  // CALLBACKS
  const handleCameraRef = useCallback((ref) => {
    setCamera(ref);
    onCameraRef(ref);
  }, [onCameraRef]);

  const handleContainedSize = useCallback(
    (onlyResult = false) => getContainedSize(ratio, onlyResult),
    [ratio],
  );

  const handleCameraReady = useCallback(() => {
    setReady(true);
    onCameraReady(camera);
  }, [camera, onCameraReady]);

  // RENDERERS
  if (!isAvailable || !hasPermission) {
    return <View style={styles.root} />;
  }
  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <Left camera={{ ref: camera, ready }} />
      <ExpoCamera
        onCameraReady={handleCameraReady}
        ref={handleCameraRef}
        ratio={ratio}
        style={handleContainedSize()}
        type={ExpoCamera.Constants.Type.back}
      >
        {showBlackScreen && <View style={styles.blackScreen} />}
        {children}
      </ExpoCamera>
      <CameraSideBar
        camera={{ ref: camera, ready }}
        Component={right}
        containerProps={sideBarProps}
      />
    </View>
  );
}

Camera.propTypes = {
  children: PropTypes.node,
  left: PropTypes.func,
  onCameraReady: PropTypes.func,
  onCameraRef: PropTypes.func,
  ratio: PropTypes.string,
  right: PropTypes.func,
  showBlackScreen: PropTypes.bool,
  sideBarProps: PropTypes.objectOf(PropTypes.any),
};

Camera.defaultProps = {
  children: null,
  left: () => null,
  onCameraReady: noop,
  onCameraRef: noop,
  ratio: '4:3',
  right: () => null,
  showBlackScreen: false,
  sideBarProps: {},
};

export default Camera;
