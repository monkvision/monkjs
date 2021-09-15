import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Provider as PaperProvider } from 'react-native-paper';

import Camera from '@monk/react-native/src/components/Camera';
import CameraSideBar from '@monk/react-native/src/components/CameraSideBar';
import CarMaskView from '@monk/react-native/src/views/CarMaskView';

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

export default function App() {
  const closeCamera = () => {
    // console.warn('Closing camera...');
  };

  const takeAPicture = () => {
    // console.warn('Taking picture...');
  };

  const showPicture = () => {
    // console.warn('Showing picture...');
  };

  return (
    <PaperProvider>
      <Camera
        leftElements={(
          <CameraSideBar>
            <FAB
              accessibilityLabel="Get advice"
              color="#EDAB25"
              icon="lightbulb-on"
              onPress={closeCamera}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Camera settings"
              icon="chevron-right"
              onPress={closeCamera}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Advanced"
              disabled
              icon="chevron-right"
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
              icon="camera-image"
              onPress={takeAPicture}
              style={[styles.fabImportant, styles.largeFab]}
            />
            <FAB
              accessibilityLabel="Show picture"
              disabled
              icon="image"
              onPress={showPicture}
              small
              style={styles.fab}
            />
          </CameraSideBar>
        )}
      >
        <CarMaskView />
      </Camera>
    </PaperProvider>
  );
}
