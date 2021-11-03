import React, { useCallback, useEffect, useRef, useState } from 'react';

import noop from 'lodash.noop';

import Components, { propTypes } from '@monkvision/react-native';
import { Sight, values } from '@monkvision/corejs';

import { View, Platform, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { FAB, Snackbar, Text, useTheme, Modal } from 'react-native-paper';

import ActivityIndicatorView from '../ActivityIndicatorView';
import AdvicesView from '../AdvicesView';

import useSights from './useSights';
import styles from './styles';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = 250;
const makeRatio = (w, h) => `${w / 240}:${h / 240}`;

const ratio = Platform.select({
  web: makeRatio(width - SIDEBAR_WIDTH, height),
  // using Math.max and Math.min to avoid having a conflict
  // between width and height while rotating the mobile screen
  native: makeRatio(Math.max(width, height) - SIDEBAR_WIDTH, Math.min(width, height)),
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

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <SafeAreaView style={styles.container}>
        <Components.PicturesScrollPreview
          activeSight={activeSight}
          sights={sights}
          pictures={pictures}
          ref={scrollRef}
        />

        <View>
          <Components.Camera onCameraReady={handleCameraReady} ratio={ratio} />
          <View style={styles.overLaps}>
            {fakeActivity ? (
              <ActivityIndicatorView />
            ) : (
              <Components.Mask
                resizeMode="contain"
                id={activeSight.id}
                width="100%"
                style={styles.mask}
              />
            )}
          </View>
        </View>

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
