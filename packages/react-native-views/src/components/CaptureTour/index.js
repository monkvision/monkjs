import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { FAB, Provider, withTheme } from 'react-native-paper';
import noop from 'lodash.noop';

import Components, { propTypes } from '@monkvision/react-native';
import { Sight, values } from '@monkvision/corejs';

import useFakeActivity from '../../hooks/useFakeActivity';
import usePictures from './hooks/usePictures';
import useUI from './hooks/useUI';
import useMobileBrowserConfig from './hooks/useMobileBrowserConfig';
import useOrientation from '../../hooks/useOrientation';

import ActivityIndicatorView from '../ActivityIndicatorView';
import { SIDEBAR_WIDTH, RATIO_FACTOR } from './constants';

import CameraControls from './CameraControls';
import CameraOverlay from './CameraOverlay';
import CameraPopUps from './CameraPopUps';
import CameraScrollView from './CameraScrollView';
import CameraOrientationView from './CameraOrientationView';

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#000',
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flex: 1, height: '100vh' },
    }),
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    minWidth: '100%',
    minHeight: '100%',
    backgroundColor: '#000',
    justifyContent: 'space-between',
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flex: 1 },
    }),
  },
  refreshIcon: { backgroundColor: '#333', position: 'absolute', top: 10, left: 60, zIndex: 100 },
});

const makeRatio = (width, height) => `${width / RATIO_FACTOR}:${height / RATIO_FACTOR}`;

/**
 *
 * @param initialPicturesState
 * @param isLoading {boolean}
 * @param onCloseCamera {func}
 * @param onRefreshUpload {func}
 * @param onSettings {func}
 * @param onTakePicture {func}
 * @param onSuccess {func}
 * @param sights {[Sight]}
 * @param sightIdsNotUploaded {[string]}
 * @param theme
 * @returns {JSX.Element}
 * @constructor
 */
function CaptureTour({
  initialPicturesState,
  isLoading,
  onCloseCamera,
  onRefreshUpload,
  onSettings,
  onTakePicture,
  onSuccess,
  sightIdsNotUploaded,
  sights,
  theme,
}) {
  // Camera must be declared first
  const [camera, handleCameraReady] = useState();

  // Use fake activity when you need to render ActivityIndicator for better UX
  const [fakeActivity, handleFakeActivity] = useFakeActivity(isLoading);

  // Wraps taken pictures with sights prop and metadata
  const picturesWrapper = usePictures(
    camera,
    sights,
    onTakePicture,
    onSuccess,
    handleFakeActivity,
    initialPicturesState,
  );

  const { activeSight, handleTakePicture, pictures } = picturesWrapper;

  // Wraps states and callbacks to manage UI in one hook place
  const ui = useUI(camera, pictures, onCloseCamera, onSettings);
  const { height, width } = ui.container.measures;
  const ratio = useMemo(() => makeRatio(width - SIDEBAR_WIDTH, height), [height, width]);

  // Mobile browser view
  const [orientation, rotateTo, isNotSupported] = useOrientation();
  const isMobileBrowser = useMobileBrowserConfig();

  const isNative = Platform.select({ native: true });
  const isNotLandscape = orientation !== 4 && orientation !== 3;

  if (isMobileBrowser || (isNative && isNotLandscape)) {
    return (
      <Provider theme={theme}>
        <CameraOrientationView
          rotateToLandscape={rotateTo.landscape}
          supportOrientation={!isNotSupported && !isMobileBrowser}
        />
      </Provider>
    );
  }
  return (
    <Provider theme={theme}>
      <View style={styles.root}>
        <StatusBar hidden />
        {/* container */}
        <SafeAreaView>
          <View style={styles.container} onLayout={ui.container.handleLayout}>
            <>
              {/* pictures scroll preview sidebar */}
              <CameraScrollView
                activeSight={activeSight}
                pictures={pictures}
                sightIdsNotUploaded={sightIdsNotUploaded}
                sights={sights}
              />

              {/* camera and mask overlay */}
              <View>
                {ui.container.measures.width && (
                  <Components.Camera
                    lockOrientationOnRender={false}
                    onCameraReady={handleCameraReady}
                    ratio={ratio}
                  />
                )}
                <CameraOverlay
                  onShowAdvices={ui.modal.handleShow}
                  activeSightId={activeSight.id}
                  camera={camera}
                  fakeActivity={Boolean(fakeActivity)}
                  theme={theme}
                />
                {(sightIdsNotUploaded.length > 0 && !fakeActivity) && (
                  <FAB
                    small
                    color="white"
                    icon="refresh"
                    style={styles.refreshIcon}
                    onPress={onRefreshUpload}
                    accessibilityLabel="Retry an upload of the pictures"
                  />
                )}
              </View>

              {/* camera sidebar */}
              <CameraControls
                fakeActivity={Boolean(fakeActivity)}
                onLeave={ui.snackbar.handleToggle}
                onSettingss={ui.modal.handleShow}
                onTakePicture={handleTakePicture}
              />
            </>
            {!camera && <ActivityIndicatorView />}
          </View>
        </SafeAreaView>

        <CameraPopUps
          onCloseCamera={ui.camera.handleClose}
          onDismissSnack={ui.snackbar.handleDismiss}
          snackIsVisible={ui.snackbar.isVisible}
          onDismissAdvices={ui.modal.handleDismiss}
          modalIsVisible={ui.modal.isVisible}
        />
      </View>
    </Provider>
  );
}

CaptureTour.propTypes = {
  initialPicturesState: propTypes.cameraPictures,
  isLoading: PropTypes.bool,
  onCloseCamera: propTypes.callback,
  onRefreshUpload: propTypes.callback,
  onSettings: propTypes.callback,
  onSuccess: propTypes.onSuccess,
  onTakePicture: propTypes.callback,
  sightIdsNotUploaded: PropTypes.arrayOf(PropTypes.string),
  sights: propTypes.sights,
};

CaptureTour.defaultProps = {
  initialPicturesState: {},
  isLoading: false,
  onCloseCamera: noop,
  onRefreshUpload: noop,
  onSettings: noop,
  onTakePicture: noop,
  onSuccess: noop,
  sightIdsNotUploaded: [],
  sights: Object.values(values.sights.abstract).map((s) => new Sight(...s)),
};

export default withTheme(CaptureTour);
