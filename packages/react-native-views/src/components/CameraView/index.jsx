import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { Provider, withTheme } from 'react-native-paper';
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
});

const makeRatio = (width, height) => `${width / RATIO_FACTOR}:${height / RATIO_FACTOR}`;

/**
 *
 * @param initialPicturesState
 * @param isLoading {boolean}
 * @param onCloseCamera {func}
 * @param onSettings {func}
 * @param onTakePicture {func}
 * @param onSuccess {func}
 * @param sights {[Sight]}
 * @param theme
 * @returns {JSX.Element}
 * @constructor
 */
function CameraView({
  initialPicturesState,
  isLoading,
  onCloseCamera,
  onSettings,
  onTakePicture,
  onSuccess,
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
  const [orientation, rotateToLandscape, isNotSupported] = useOrientation();
  const isMobileBrowser = useMobileBrowserConfig();

  const isNative = Platform.select({ native: true });
  const isNotLandscape = orientation !== 4 && orientation !== 3;

  if (isMobileBrowser || (isNative && isNotLandscape)) {
    return (
      <Provider theme={theme}>
        <CameraOrientationView
          rotateToLandscape={rotateToLandscape}
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
                  activeSightId={activeSight.id}
                  camera={camera}
                  fakeActivity={Boolean(fakeActivity)}
                  theme={theme}
                />
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
        />
      </View>
    </Provider>
  );
}

CameraView.propTypes = {
  initialPicturesState: propTypes.cameraPictures,
  isLoading: PropTypes.bool,
  onCloseCamera: propTypes.callback,
  onSettings: propTypes.callback,
  onSuccess: propTypes.onSuccess,
  onTakePicture: propTypes.callback,
  sights: propTypes.sights,
};

CameraView.defaultProps = {
  initialPicturesState: {},
  isLoading: false,
  onCloseCamera: noop,
  onSettings: noop,
  onTakePicture: noop,
  onSuccess: noop,
  sights: Object.values(values.sights.abstract).map((s) => new Sight(...s)),
};

export default withTheme(CameraView);
