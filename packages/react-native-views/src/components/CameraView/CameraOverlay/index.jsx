import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Components, { propTypes, utils } from '@monkvision/react-native';

import ActivityIndicatorView from '../../ActivityIndicatorView';

const styles = StyleSheet.create({
  overLaps: {
    ...utils.styles.flex,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    width: '100%',
    height: '100%',
  },
  mask: {
    width: '100%',
    height: '100%',
  },
});

function CameraOverlay({ activeSightId, camera, fakeActivity }) {
  const maskCanMount = useMemo(
    () => (!fakeActivity && camera),
    [camera, fakeActivity],
  );

  return (
    <View style={styles.overLaps}>
      {fakeActivity && <ActivityIndicatorView />}
      {maskCanMount && (
        <Components.Mask
          id={activeSightId}
          resizeMode="contain"
          style={styles.mask}
          width="100%"
        />
      )}
    </View>
  );
}

export default CameraOverlay;

CameraOverlay.propTypes = {
  activeSightId: PropTypes.string.isRequired,
  camera: propTypes.camera,
  fakeActivity: PropTypes.bool.isRequired,
};

CameraOverlay.defaultProps = {
  camera: null,
};
