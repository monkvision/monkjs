import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { StyleSheet } from 'react-native';
import { FAB, Text } from 'react-native-paper';

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
});

/**
 *
 * @param onCloseCamera {func}
 * @param onShowAdvice {func}
 * @param onTakePicture {func}
 * @param sightMasks {{string}}
 * @param sights {[Sight]}
 * @returns {JSX.Element}
 * @constructor
 */
export default function CameraView({
  onCloseCamera,
  onShowAdvice,
  onTakePicture,
  sightMasks,
  sights,
}) {
  const { activeSight, nextSightProps } = useSights(sights);

  const sightMask = useMemo(
    () => sightMasks[activeSight.id],
    [activeSight.id, sightMasks],
  );

  const [pictures, setPictures] = useState({});

  const [ready, setReady] = useState(false);
  const handleCameraReady = useCallback(() => {
    setReady(true);
  }, [setReady]);

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
      left={() => <Text style={{ color: 'white' }}>{activeSight.id}</Text>}
      onCameraReady={handleCameraReady}
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
      {(ready && sightMask) && <Mask alt={activeSight.id} xml={sightMask} />}
    </Camera>
  );
}

CameraView.propTypes = {
  onCloseCamera: PropTypes.func,
  onShowAdvice: PropTypes.func,
  // onSightsDone: PropTypes.func,
  onTakePicture: PropTypes.func,
  sightMasks: PropTypes.objectOf(PropTypes.string),
  sights: PropTypes.arrayOf(PropTypes.array),
};

CameraView.defaultProps = {
  onCloseCamera: noop,
  onShowAdvice: noop,
  // onSightsDone: noop,
  onTakePicture: noop,
  sightMasks: {},
  sights: [],
};
