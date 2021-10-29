import React, { useCallback, useEffect, useRef, useState } from 'react';

import noop from 'lodash.noop';

import Components, { propTypes, utils } from '@monkvision/react-native';
import { Sight, values } from '@monkvision/corejs';

import { View, Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { FAB, Snackbar, Text, useTheme, Modal } from 'react-native-paper';

import ActivityIndicatorView from '../ActivityIndicatorView';
import AdvicesView from '../AdvicesView';

import useSights from './useSights';

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
    backgroundColor: '#000',
    justifyContent: 'space-between',
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flex: 1 },
    }),
  },
  fab: {
    backgroundColor: '#333',
  },
  fabImportant: {
    backgroundColor: 'white',
  },
  largeFab: {
    transform: [{ scale: 1.75 }],
  },
  overLaps: {
    ...utils.styles.flex,
    ...utils.styles.getContainedSizes('4:3'),
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  snackBar: {
    display: 'flex',
    backgroundColor: 'white',
    alignSelf: 'center',
    ...Platform.select({
      native: { width: 300 },
    }),
  },
  advices: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    maxWidth: 512,
    ...Platform.select({
      web: { maxHeight: 512 },
      native: { maxHeight: 300 },
    }),
    alignSelf: 'center',
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
      handleFakeActivity(() => onSuccess(pictures, camera, sights));
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
          <Components.Camera onCameraReady={handleCameraReady} />
          <View style={styles.overLaps}>
            {fakeActivity ? <ActivityIndicatorView /> : <Components.Mask id={activeSight.id} />}
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
