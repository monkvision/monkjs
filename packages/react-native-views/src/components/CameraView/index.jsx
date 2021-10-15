import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { Camera, CameraSideBar, Mask, PicturesScrollPreview, utils } from '@monkvision/react-native/src/index';
import { View, Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import ActivityIndicatorView from '../ActivityIndicatorView';
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
    transform: [{ scale: 1.5 }],
  },
  overLaps: {
    ...utils.styles.flex,
    ...utils.styles.getContainedSizes('4:3'),
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
});

/**
 *
 * @param onCloseCamera {func}
 * @param onShowAdvice {func}
 * @param onTakePicture {func}
 * @param sights {[Sight]}
 * @returns {JSX.Element}
 * @constructor
 */
export default function CameraView({
  onCloseCamera,
  onShowAdvice,
  onTakePicture,
  sights,
}) {
  // STATE TO PROPS
  const scrollRef = useRef();
  const [fakeActivity, setFakeActivity] = useState(null);
  const [camera, setCamera] = useState();
  const [pictures, setPictures] = useState({});
  const { activeSight, nextSightProps } = useSights(sights);

  // PICTURES
  const handleTakePicture = useCallback(async () => {
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
  }, [activeSight, camera, nextSightProps, onTakePicture, pictures]);

  // CAMERA
  const handleCloseCamera = useCallback(() => {
    onCloseCamera(pictures);
  }, [onCloseCamera, pictures]);

  const handleCameraReady = useCallback(setCamera, [setCamera]);

  // UI
  const handleShowAdvice = () => {
    // console.warn('Showing advice...');
    onShowAdvice(pictures);
  };

  useEffect(() => {
    const fakeActivityId = setTimeout(() => {
      setFakeActivity(null);
    }, 500);

    setFakeActivity(fakeActivityId);

    return () => { clearTimeout(fakeActivityId); };
  }, [activeSight.id]);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <SafeAreaView style={styles.container}>
        <PicturesScrollPreview
          activeSight={activeSight}
          sights={sights}
          pictures={pictures}
          ref={scrollRef}
        />
        <View>
          <Camera onCameraReady={handleCameraReady} />
          <View style={styles.overLaps}>
            {fakeActivity ? <ActivityIndicatorView /> : <Mask id={activeSight.id} />}
          </View>
        </View>
        <CameraSideBar>
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
            onPress={handleCloseCamera}
            small
            style={styles.fab}
          />
        </CameraSideBar>
      </SafeAreaView>
    </View>
  );
}

CameraView.propTypes = {
  onCloseCamera: PropTypes.func,
  onShowAdvice: PropTypes.func,
  onTakePicture: PropTypes.func,
  sights: PropTypes.arrayOf(PropTypes.array),
};

CameraView.defaultProps = {
  onCloseCamera: noop,
  onShowAdvice: noop,
  onTakePicture: noop,
  sights: [
    ['abstractFront', [null, 0, null], 'front'],
    ['abstractFrontLeft', [null, 30, null], 'front left'],
    ['abstractFrontLateralLeft', [null, 60, null], 'front side left'],
    ['abstractMiddleLateralLeft', [null, 90, null], 'middle side left'],
    ['abstractRearLateralLeft', [null, 120, null], 'read side left'],
    ['abstractRearLeft', [null, 150, null], 'rear left'],
    ['abstractRear', [null, 180, null], 'rear'],
    ['abstractRearRight', [null, 210, null], 'rear right'],
    ['abstractRearLateralRight', [null, 240, null], 'rear side right'],
    ['abstractMiddleLateralRight', [null, 270, null], 'middle side right'],
    ['abstractFrontLateralRight', [null, 300, null], 'front side right'],
    ['abstractFrontRight', [null, 330, null], 'front right'],
  ],
};
