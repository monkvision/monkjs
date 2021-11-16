import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions } from 'react-native';
import Components, { propTypes, utils } from '@monkvision/react-native';

import ActivityIndicatorView from '../../ActivityIndicatorView';
import useMobileBrowserConfig from '../hooks/useMobileBrowserConfig';
import { SIDEBAR_WIDTH } from '../constants';

const { width } = Dimensions.get('window');

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
  const maskCanMount = useMemo(() => !fakeActivity && camera, [camera, fakeActivity]);
  const isMobileBrowser = useMobileBrowserConfig();

  return (
    <View style={[styles.overLaps, { width: width - SIDEBAR_WIDTH }]}>
      {fakeActivity && <ActivityIndicatorView />}
      {maskCanMount && (
        <Components.Mask
          id={activeSightId}
          resizeMode="contain"
          style={[styles.mask, isMobileBrowser ? { width: '100%' } : {}]}
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
