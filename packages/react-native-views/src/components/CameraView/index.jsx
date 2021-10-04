import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import Camera from '@monkvision/react-native/src/components/Camera';
import Gallery from '@monkvision/react-native/src/components/Gallery';

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

export default function CameraView({ onCloseCamera, onShowAdvice, onTakePicture }) {
  const [pictures, setPictures] = useState([]);
  const [blackScreen, setBlackScreen] = useState(false);

  const handleCloseCamera = useCallback(() => {
    onCloseCamera(pictures);
  }, [onCloseCamera, pictures]);

  const handleTakePicture = useCallback(async (camera) => {
    if (camera.ready) {
      setBlackScreen(true);

      const options = { quality: 1 };
      const picture = await camera.ref.takePictureAsync(options);

      setPictures((prevState) => prevState.concat({
        id: 'uniqPartId',
        source: picture,
      }));

      onTakePicture(picture, pictures, camera);
    }
  }, [onTakePicture, pictures]);

  const handleShowAdvice = () => {
    // console.warn('Showing advice...');
    onShowAdvice(pictures);
  };

  useEffect(() => {
    const id = setTimeout(() => setBlackScreen(false), 200);
    return () => clearTimeout(id);
  }, [blackScreen]);

  return (
    <Camera
      left={() => <Gallery pictures={pictures} setPictures={setPictures} />}
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
            disabled={blackScreen}
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
      showBlackScreen={blackScreen}
    />
  );
}

CameraView.propTypes = {
  onCloseCamera: PropTypes.func,
  onShowAdvice: PropTypes.func,
  onTakePicture: PropTypes.func,
};

CameraView.defaultProps = {
  onCloseCamera: noop,
  onShowAdvice: noop,
  onTakePicture: noop,
};
