import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { StyleSheet } from 'react-native';
import { FAB, Text } from 'react-native-paper';

import Camera from '@monkvision/react-native/src/components/Camera';

import useSights from './useSights';
import defaultSights from './sights.json';

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
export default function CameraView({ onCloseCamera, onShowAdvice, onTakePicture, sights }) {
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
      left={() => <Text>{activeSight.id}</Text>}
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
    />
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
  sights: defaultSights,
};
