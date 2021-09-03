import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Provider as PaperProvider } from 'react-native-paper';

import Camera from 'components/Camera';
import CameraSideBar from 'components/CameraSideBar';

const styles = StyleSheet.create({
  fab: {
    backgroundColor: 'white',
  },
  largeFab: {
    transform: [{ scale: 1.3 }],
  },
});

export default function App() {
  function closeCamera() {
    // console.warn('Closing camera...');
  }

  function takeAPicture() {
    // console.warn('Taking picture...');
  }

  function showGallery() {
    // console.warn('Showing gallery...');
  }

  return (
    <PaperProvider>
      <Camera
        leftElements={(
          <CameraSideBar>
            <FAB
              accessibilityLabel="Close camera"
              color="#EDAB25"
              icon="lightbulb-on"
              onPress={closeCamera}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Close camera"
              icon="chevron-right"
              onPress={closeCamera}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Close camera"
              disabled
              icon="chevron-right"
              onPress={closeCamera}
              small
              style={[styles.fab, { visibility: 'hidden', opacity: 0 }]}
            />
          </CameraSideBar>
        )}
        rightElements={(
          <CameraSideBar>
            <FAB
              accessibilityLabel="Close camera"
              icon="close-thick"
              onPress={closeCamera}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Take a picture"
              color="#000"
              icon="camera-image"
              onPress={takeAPicture}
              style={[styles.fab, styles.largeFab]}
            />
            <FAB
              accessibilityLabel="Show gallery"
              icon="folder-multiple-image"
              onPress={showGallery}
              small
              style={styles.fab}
            />
          </CameraSideBar>
        )}
      />
    </PaperProvider>
  );
}
