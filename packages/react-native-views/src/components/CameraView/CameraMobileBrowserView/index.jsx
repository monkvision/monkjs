import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Dimensions } from 'react-native';
import Components, { propTypes } from '@monkvision/react-native';

import noop from 'lodash.noop';
import PropTypes from 'prop-types';

import ActivityIndicatorView from '../../ActivityIndicatorView';

import CameraControls from '../CameraControls';
import CameraOverlay from '../CameraOverlay';
import CameraPopUps from '../CameraPopUps';
import CameraScrollView from '../CameraScrollView';
import { SIDEBAR_WIDTH } from '../constants';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000',
    display: 'flex',
    flex: 1,
    height: '100vh',
    overflow: 'hidden',
    minHeight: width,
    minWidth: height,
    left: -Math.abs(width - height),
    transform: [{ rotate: '90deg' }],
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    display: 'flex',
    maxHeight: width,
    maxWidth: height,
  },
  cameraContainer: {
    zIndex: -1,
    marginTop: SIDEBAR_WIDTH / 2,
  },
});

/**
 *
 * @param onCloseCamera {func}
 * @param onShowAdvice {func}
 * @param onTakePicture {func}
 * @param onSuccess {func}
 * @param sights {[Sight]}
 * @returns {JSX.Element}
 * @constructor
 */
export default function CameraMobileBrowserView({
  sights,
  ui,
  activeSight,
  pictures,
  handleCameraReady,
  ratio,
  camera,
  fakeActivity,
  handleTakePicture,
}) {
  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {/* container */}
      <SafeAreaView>
        <View style={styles.container} onLayout={ui.container.handleLayout}>
          {/* pictures scroll preview sidebar */}
          <CameraScrollView activeSight={activeSight} pictures={pictures} sights={sights} />

          {/* camera and mask overlay */}
          <View
            style={{
              height: ui.container.measures.height,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}
          >
            <View
              style={[
                styles.cameraContainer,
                {
                  ...ui.container.measures,
                  width: width - SIDEBAR_WIDTH,
                  transform: [{ rotate: '-90deg' }, { scale: 0.8 }],
                },
              ]}
            >
              {ui.container.measures.width && (
                <Components.Camera onCameraReady={handleCameraReady} ratio={ratio} />
              )}
            </View>
            <CameraOverlay
              activeSightId={activeSight.id}
              camera={camera}
              fakeActivity={Boolean(fakeActivity)}
            />
          </View>

          {/* camera sidebar */}
          <CameraControls
            fakeActivity={Boolean(fakeActivity)}
            onLeave={ui.snackbar.handleToggle}
            onShowAdvices={ui.modal.handleShow}
            onTakePicture={handleTakePicture}
          />
          {!camera && <ActivityIndicatorView />}
        </View>

        <CameraPopUps
          modalIsVisible={ui.modal.isVisible}
          onCloseCamera={ui.camera.handleClose}
          onDismissAdvices={ui.modal.handleDismiss}
          onDismissSnack={ui.snackbar.handleDismiss}
          snackIsVisible={ui.snackbar.isVisible}
        />
      </SafeAreaView>
    </View>
  );
}

CameraMobileBrowserView.propTypes = {
  activeSight: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, propTypes.sights]))
    .isRequired,
  camera: propTypes.camera,
  fakeActivity: noop.isRequired,
  handleCameraReady: PropTypes.func.isRequired,
  handleTakePicture: PropTypes.func.isRequired,
  pictures: propTypes.cameraPictures.isRequired,
  ratio: PropTypes.string.isRequired,
  sights: propTypes.sights.isRequired,
  ui: PropTypes.objectOf({
    camera: PropTypes.objectOf({ handleClose: PropTypes.func }),
    modal: PropTypes.objectOf({
      handleDismiss: PropTypes.func,
      handleShow: PropTypes.func,
      isVisible: PropTypes.bool,
    }),
    snackbar: PropTypes.objectOf({
      handleDismiss: PropTypes.func,
      handleToggle: PropTypes.func,
      isVisible: PropTypes.bool,
    }),
  }).isRequired,
};
CameraMobileBrowserView.defaultProps = {
  camera: null,
};
