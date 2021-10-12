import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { FAB, Surface, Text, useTheme } from 'react-native-paper';

import Camera from '@monkvision/react-native/src/components/Camera';
import Mask from '@monkvision/react-native/src/components/Mask';

import useSights from './useSights';

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#333',
  },
  fabImportant: {
    backgroundColor: 'white',
  },
  largeFab: {
    transform: [{ scale: 1.3 }],
  },
  badge: {
    position: 'absolute',
    height: 38,
    borderRadius: 5,
    top: 16,
    left: 16,
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 38,
    color: 'white',
    paddingHorizontal: 12,
  },
  left: {
    marginVertical: 4,
  },
  surface: {
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 16,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
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
  const { colors } = useTheme();

  const { activeSight, nextSightProps } = useSights(sights);

  const [pictures, setPictures] = useState({});

  const handleCloseCamera = useCallback(() => {
    onCloseCamera(pictures);
  }, [onCloseCamera, pictures]);

  const handleTakePicture = useCallback(async (camera) => {
    if (camera.ready) {
      const options = { quality: 1 };
      const picture = await camera.ref.takePictureAsync(options);

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
  }, [activeSight, nextSightProps, onTakePicture, pictures]);

  const handleShowAdvice = () => {
    // console.warn('Showing advice...');
    onShowAdvice(pictures);
  };

  return (
    <Camera
      left={() => (
        <SafeAreaView style={styles.left}>
          <ScrollView>
            {sights.map(([id]) => (
              <Surface style={[styles.surface, { backgroundColor: colors.primary }]}>
                <Mask id={id} />
              </Surface>
            ))}
          </ScrollView>
        </SafeAreaView>
      )}
      right={({ camera }) => (
        <>
          <FAB
            accessibilityLabel="Show advice"
            color="#edab25"
            icon="lightbulb-on"
            onPress={handleShowAdvice}
            small
            style={styles.fab}
          />
          <FAB
            accessibilityLabel="Take a picture"
            icon="camera-image"
            onPress={() => handleTakePicture(camera)}
            style={[styles.fabImportant, styles.largeFab]}
          />
          <FAB
            accessibilityLabel="Close camera"
            icon="close"
            onPress={handleCloseCamera}
            small
            style={styles.fab}
          />
        </>
      )}
    >
      <Mask id={activeSight.id} />
      <Text style={[styles.badge, { backgroundColor: colors.primary }]}>
        {activeSight.id}
      </Text>
    </Camera>
  );
}

CameraView.propTypes = {
  onCloseCamera: PropTypes.func,
  onShowAdvice: PropTypes.func,
  // onSightsDone: PropTypes.func,
  onTakePicture: PropTypes.func,
  sights: PropTypes.arrayOf(PropTypes.array),
};

CameraView.defaultProps = {
  onCloseCamera: noop,
  onShowAdvice: noop,
  // onSightsDone: noop,
  onTakePicture: noop,
  sights: [],
};
