import React, { useCallback, useEffect, useRef, useState } from 'react';

import noop from 'lodash.noop';

import Components, { propTypes } from '@monkvision/react-native';
import { Sight, values } from '@monkvision/corejs';

import { View, Platform, SafeAreaView, StatusBar } from 'react-native';
import { FAB, Snackbar, Text, useTheme, Modal } from 'react-native-paper';

import ActivityIndicatorView from '../ActivityIndicatorView';
import AdvicesView from '../AdvicesView';

import useSights from './useSights';
import styles from './styles';
import useBrowserViewConfig from '../../hooks/useBrowserViewConfig';
import MobileBrowserView from './mobileBrowserView';

const SIDEBAR_WIDTH = 250;
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
  // STATE TO PROPS
  const scrollRef = useRef();
  const [fakeActivity, setFakeActivity] = useState(null);
  const [camera, setCamera] = useState();
  const [pictures, setPictures] = useState({});

  const { activeSight, count, nextSightProps } = useSights(sights);

  const handleFakeActivity = useCallback((onEnd = noop) => {
    const fakeActivityId = setTimeout(() => {
      setFakeActivity(null);
      onEnd();
    }, 500);

    setFakeActivity(fakeActivityId);

    return () => {
      clearTimeout(fakeActivityId);
    };
  }, []);

  // PICTURES
  const handleTakePicture = useCallback(async () => {
    handleFakeActivity();

    if (camera) {
      const options = { quality: 1 };
      const picture = await camera.takePictureAsync(options);

      setPictures((prevState) => ({
        ...prevState,
        [activeSight.id]: {
          sight: activeSight,
          source: picture,
        },
      }));

      onTakePicture(picture, pictures, camera);

      if (!nextSightProps.disabled) {
        nextSightProps.onPress();
      }
    }
  }, [activeSight, camera, handleFakeActivity, nextSightProps, onTakePicture, pictures]);

  // UI
  const { colors } = useTheme();

  const [visibleSnack, setVisibleSnack] = useState(false);
  const toggleSnackBar = () => setVisibleSnack((prev) => !prev);
  const handleDismissSnackBar = () => setVisibleSnack(false);

  const [visibleAdvices, setVisibleAdvices] = useState(false);
  const showAdvices = () => {
    camera?.pausePreview();
    setVisibleAdvices(true);
  };
  const hideAdvices = () => {
    camera?.resumePreview();
    setVisibleAdvices(false);
  };
  const handleShowAdvice = () => {
    showAdvices();
    onShowAdvice(pictures);
  };

  // CAMERA
  const handleCloseCamera = useCallback(() => {
    onCloseCamera(pictures);
  }, [onCloseCamera, pictures]);

  const handleCameraReady = useCallback(setCamera, [setCamera]);

  // EFFECTS
  useEffect(() => {
    const picturesTaken = Object.values(pictures).filter((p) => Boolean(p.source)).length;
    if (count === picturesTaken) {
      handleFakeActivity(() => onSuccess({ pictures, camera, sights }));
    }
  }, [camera, count, handleFakeActivity, onSuccess, pictures, sights]);
  const [measures, setMeasures] = React.useState({ width: null, height: null });

  // MOBILE BROWSER VIEW
  const isLandscape = useBrowserViewConfig();
  if (!isLandscape) {
    return (
      <MobileBrowserView
        activeSight={activeSight}
        camera={camera}
        fakeActivity={fakeActivity}
        handleCameraReady={handleCameraReady}
        handleShowAdvice={handleShowAdvice}
        handleTakePicture={handleTakePicture}
        hideAdvices={hideAdvices}
        pictures={pictures}
        sights={sights}
        toggleSnackBar={toggleSnackBar}
        visibleSnack={visibleSnack}
        visibleAdvices={visibleAdvices}
        handleDismissSnackBar={handleDismissSnackBar}
        handleCloseCamera={handleCloseCamera}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <SafeAreaView>
        <View
          style={styles.container}
          onLayout={(e) => {
            const layout = e.nativeEvent.layout;
            setMeasures({
              // shortest to be height always
              height: Math.min(layout.width, layout.height),
              // longest to be width always
              width: Math.max(layout.width, layout.height),
            });
          }}
        >
          {/* pictures scroll preview sidebar */}
          <Components.PicturesScrollPreview
            activeSight={activeSight}
            sights={sights}
            pictures={pictures}
            ref={scrollRef}
          />

          {/* camera and mask overlay */}
          <View>
            {measures.width ? (
              <Components.Camera
                onCameraReady={handleCameraReady}
                ratio={makeRatio(measures.width, measures.height)}
              />
            ) : null}
            <View style={styles.overLaps}>
              {fakeActivity && <ActivityIndicatorView />}
              {!fakeActivity && camera && (
                <Components.Mask
                  resizeMode="contain"
                  id={activeSight.id}
                  width="100%"
                  style={styles.mask}
                />
              )}
            </View>
          </View>

          {/* camera sidebar */}
          <Components.CameraSideBar>
            <FAB
              accessibilityLabel="Advices"
              color="#edab25"
              disabled={fakeActivity}
              icon={Platform.OS !== 'ios' ? 'lightbulb-on' : undefined}
              label={Platform.OS === 'ios' ? 'Advices' : undefined}
              onPress={handleShowAdvice}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Take a picture"
              disabled={fakeActivity}
              icon="camera-image"
              onPress={handleTakePicture}
              style={[styles.fabImportant, styles.largeFab]}
            />
            <FAB
              accessibilityLabel="Close camera"
              disabled={fakeActivity}
              icon={Platform.OS !== 'ios' ? 'close' : undefined}
              label={Platform.OS === 'ios' ? 'Close' : undefined}
              onPress={toggleSnackBar}
              small
              style={styles.fab}
            />
          </Components.CameraSideBar>
        </View>
      </SafeAreaView>

      <Modal
        visible={visibleAdvices}
        onDismiss={hideAdvices}
        contentContainerStyle={styles.advices}
      >
        <AdvicesView onDismiss={hideAdvices} />
      </Modal>

      <Snackbar
        visible={visibleSnack}
        onDismiss={handleDismissSnackBar}
        duration={14000}
        style={styles.snackBar}
        action={{
          label: 'Leave',
          onPress: handleCloseCamera,
          color: colors.error,
        }}
      >
        <Text style={{ color: colors.warning }}>You are leaving the process, are you sure ?</Text>
      </Snackbar>
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
