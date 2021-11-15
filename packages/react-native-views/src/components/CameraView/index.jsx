import React, { useCallback, useMemo, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Components, { propTypes } from '@monkvision/react-native';
import { Sight, values } from '@monkvision/corejs';
import noop from 'lodash.noop';

import useFakeActivity from './hooks/useFakeActivity';
import usePictures from './hooks/usePictures';
import useSuccess from './hooks/useSuccess';
import useUI from './hooks/useUI';
import useMobileBrowserConfig from './hooks/useMobileBrowserConfig';

import ActivityIndicatorView from '../ActivityIndicatorView';
import { SIDEBAR_WIDTH } from './constants';

import CameraControls from './CameraControls';
import CameraOverlay from './CameraOverlay';
import CameraPopUps from './CameraPopUps';
import CameraScrollView from './CameraScrollView';
import CameraMobileBrowserView from './CameraMobileBrowserView';

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

const makeRatio = (width, height) => `${(width - SIDEBAR_WIDTH) / 240}:${height / 240}`;

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
export default function CameraView({
  onCloseCamera,
  onShowAdvice,
  onTakePicture,
  onSuccess,
  sights,
}) {
  // Camera must be declared first
  const [camera, handleCameraReady] = useState();

  // Use fake activity when you need to render ActivityIndicator for better UX
  const [fakeActivity, handleFakeActivity] = useFakeActivity();

  // Wraps taken pictures with Sights sights prop and metadata
  const picturesWrapper = usePictures(camera, sights, onTakePicture, handleFakeActivity);
  const { activeSight, handleTakePicture, pictures } = picturesWrapper;

  // Data payload given for common user callbacks
  const payload = useMemo(() => ({ pictures, camera, sights }), [camera, pictures, sights]);

  // Wraps states and callbacks to manage UI in one hook place
  const ui = useUI(camera, pictures, onCloseCamera, onShowAdvice);
  const { height, width } = ui.container.measures;
  const ratio = useMemo(() => makeRatio(width, height), [height, width]);

  // When last picture is taken
  useSuccess(onSuccess, payload, handleFakeActivity);

  const onRotateToPortrait = useCallback(
    // eslint-disable-next-line no-alert
    () => alert(`For better experience, please rotate your device to landscape.w${width} h${height}`),
    [width, height],
  );

  // Mobile browser view
  const isMobileBrowser = useMobileBrowserConfig(onRotateToPortrait);
  if (isMobileBrowser) {
    return (
      <CameraMobileBrowserView
        sights={sights}
        ui={ui}
        activeSight={activeSight}
        pictures={pictures}
        handleCameraReady={handleCameraReady}
        ratio={ratio}
        camera={camera}
        fakeActivity={fakeActivity}
        handleTakePicture={handleTakePicture}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {/* container */}
      <SafeAreaView>
        <View style={styles.container} onLayout={ui.container.handleLayout}>
          <>
            {/* pictures scroll preview sidebar */}
            <CameraScrollView activeSight={activeSight} pictures={pictures} sights={sights} />

            {/* camera and mask overlay */}
            <View>
              {ui.container.measures.width && (
                <Components.Camera onCameraReady={handleCameraReady} ratio={ratio} />
              )}
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
          </>
          {!camera && <ActivityIndicatorView />}
        </View>
      </SafeAreaView>

      <CameraPopUps
        modalIsVisible={ui.modal.isVisible}
        onCloseCamera={ui.camera.handleClose}
        onDismissAdvices={ui.modal.handleDismiss}
        onDismissSnack={ui.snackbar.handleDismiss}
        snackIsVisible={ui.snackbar.isVisible}
      />
    </View>
  );
}

CameraView.propTypes = {
  onCloseCamera: propTypes.callback,
  // onError: propTypes.onError,
  onShowAdvice: propTypes.callback,
  onSuccess: propTypes.onSuccess,
  onTakePicture: propTypes.callback,
  sights: propTypes.sights,
};

CameraView.defaultProps = {
  onCloseCamera: noop,
  // onError: noop,
  onShowAdvice: noop,
  onTakePicture: noop,
  onSuccess: noop,
  sights: Object.values(values.sights.abstract).map((s) => new Sight(...s)),
};
