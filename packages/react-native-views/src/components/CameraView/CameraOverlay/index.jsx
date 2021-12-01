import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions } from 'react-native';
import { withTheme } from 'react-native-paper';
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

  const overlayWidth = isMobileBrowser ? width - SIDEBAR_WIDTH : '100%';
  return (
    <View style={[styles.overLaps, { width: overlayWidth }]}>
      {fakeActivity && <ActivityIndicatorView />}
      {maskCanMount && (
        <Components.Mask id={activeSightId} resizeMode="contain" style={styles.mask} width="100%" />
      )}
    </View>
  );
}

CameraOverlay.propTypes = {
  activeSightId: PropTypes.string.isRequired,
  camera: propTypes.camera,
  fakeActivity: PropTypes.bool.isRequired,
};

CameraOverlay.defaultProps = {
  camera: null,
};

export default withTheme(CameraOverlay);
