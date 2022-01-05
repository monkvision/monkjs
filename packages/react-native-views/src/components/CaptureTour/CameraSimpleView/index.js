import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Platform, SafeAreaView, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
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

function gcd(a, b) {
  return (b === 0) ? a : gcd(b, a % b);
}
/* ratio is to get the gcd and divide each component
by the gcd, then return a string with the typical colon-separated value */
function ratio(w, h) {
  const c = gcd(w, h);
  return `${w / c}:${h / c}`;
}

const styles = StyleSheet.create({
  root: {
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
    marginTop: -10,
    justifyContent: 'space-between',
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flex: 1 },
    }),
  },
  controls: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
});

/**
 *
 * @param initialPicturesState
 * @param isLoading {boolean}
 * @param onCloseCamera {func}
 * @param onSettings {func}
 * @param onTakePicture {func}
 * @param renderOverlay {element}
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
  renderOverlay: RenderOverlay,
  theme,
}) {
  const { width, height } = useWindowDimensions();
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
              {/* camera and mask overlay */}
              {ui.container.measures.width && (
                <Components.Camera
                  lockOrientationOnRender={false}
                  onCameraReady={handleCameraReady}
                  ratio={ratio(width, height - (height - ui.container.measures.height))}
                />
              )}
              {/* camera sidebar */}
              <View style={styles.controls}>
                <CameraControls
                  fakeActivity={Boolean(fakeActivity)}
                  onLeave={ui.camera.handleClose}
                  onSettings={ui.modal.handleShow}
                  onTakePicture={handleTakePicture}
                />
              </View>

            </>
            {!camera && <ActivityIndicatorView />}
            <RenderOverlay />
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
  renderOverlay: PropTypes.func,
};

CameraSimpleView.defaultProps = {
  initialPicturesState: {},
  isLoading: false,
  onCloseCamera: noop,
  onSettings: noop,
  onTakePicture: noop,
  renderOverlay: () => <></>,
};

export default withTheme(CameraSimpleView);
