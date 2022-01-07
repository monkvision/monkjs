import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { Provider, withTheme } from 'react-native-paper';
import noop from 'lodash.noop';

import Components, { propTypes } from '@monkvision/react-native';

import useFakeActivity from '../../../hooks/useFakeActivity';
import useUI from '../hooks/useUI';
import useMobileBrowserConfig from '../hooks/useMobileBrowserConfig';
import useOrientation from '../../../hooks/useOrientation';

import ActivityIndicatorView from '../../ActivityIndicatorView';
import CameraControls from '../CameraControls';
import CameraOrientationView from '../CameraOrientationView';

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
    justifyContent: 'center',
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flex: 1 },
    }),
  },
  controls: {
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 99,
    height: '100%',
    width: 125,
    backgroundColor: '#000',
  },
  leftSidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 99,
  },
});

/**
 *
 * @param initialPicturesState
 * @param isLoading {boolean}
 * @param onCloseCamera {func}
 * @param onSettings {func}
 * @param onTakePicture {func}
 * @param renderLeftSidebar {func}
 * @param theme
 * @returns {JSX.Element}
 * @constructor
 */
function CameraSimpleView({
  initialPicturesState,
  isLoading,
  onCloseCamera,
  onSettings,
  onTakePicture,
  renderLeftSidebar: RenderLeftSidebar,
  theme,
}) {
  // Camera must be declared first
  const [camera, handleCameraReady] = useState();

  // Use fake activity when you need to render ActivityIndicator for better UX
  const [fakeActivity, handleFakeActivity] = useFakeActivity(isLoading);

  const [pictures, setPictures] = useState(initialPicturesState);

  const handleTakePicture = useCallback(async () => {
    if (!camera) { return; }
    const options = { quality: 1, zoom: 0, base64: true };
    handleFakeActivity();
    const picture = await camera.takePictureAsync(options);
    setPictures((prevState) => [...prevState, picture]);
    onTakePicture(picture);
  }, [camera, handleFakeActivity, onTakePicture]);

  // Wraps states and callbacks to manage UI in one hook place
  const ui = useUI(camera, pictures, onCloseCamera, onSettings);
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
        <SafeAreaView>
          <View style={styles.container} onLayout={ui.container.handleLayout}>
            <>
              {/* optional left sidebar */}
              <View style={styles.leftSidebar}>
                <RenderLeftSidebar />
              </View>

              {/* camera and mask overlay */}
              {Platform.OS === 'web' ? (
                ui.container.measures.width && (
                  <Components.Camera
                    lockOrientationOnRender={false}
                    onCameraReady={handleCameraReady}
                    ratio="4:3"
                  />
                )
              ) : ui.container.measures.width && (
                <View>
                  <Components.Camera
                    lockOrientationOnRender={false}
                    onCameraReady={handleCameraReady}
                    ratio="4:3"
                  />
                </View>
              )}

              {/* camera sidebar */}
              <View style={styles.controls}>
                <CameraControls
                  fakeActivity={Boolean(fakeActivity)}
                  onLeave={ui.camera.handleClose}
                  onSettings={() => null}
                  onTakePicture={handleTakePicture}
                />
              </View>
              {!camera && <ActivityIndicatorView />}
            </>
          </View>
        </SafeAreaView>
      </View>
    </Provider>
  );
}

CameraSimpleView.propTypes = {
  initialPicturesState: propTypes.cameraPictures,
  isLoading: PropTypes.bool,
  onCloseCamera: propTypes.callback,
  onSettings: propTypes.callback,
  onTakePicture: propTypes.callback,
  renderLeftSidebar: PropTypes.func,
};

CameraSimpleView.defaultProps = {
  initialPicturesState: {},
  isLoading: false,
  onCloseCamera: noop,
  onSettings: noop,
  onTakePicture: noop,
  renderLeftSidebar: () => <></>,
};

export default withTheme(CameraSimpleView);
