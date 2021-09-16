import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FAB, Provider as PaperProvider } from 'react-native-paper';

import Camera from '@monk/react-native/module/components/Camera';
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
              icon={(props) => <MaterialCommunityIcons name="lightbulb-on" {...props} />}
              onPress={closeCamera}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Camera settings"
              icon={(props) => <MaterialCommunityIcons name="chevron-right" {...props} />}
              onPress={closeCamera}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Advanced"
              disabled
              icon={(props) => <MaterialCommunityIcons name="chevron-right" {...props} />}
              small
              style={[styles.fab, { visibility: 'hidden', opacity: 0 }]}
            />
          </CameraSideBar>
        )}
        rightElements={(
          <CameraSideBar>
            <FAB
              accessibilityLabel="Close camera"
              icon={(props) => <MaterialCommunityIcons name="close-thick" {...props} />}
              onPress={closeCamera}
              small
              style={styles.fab}
            />
            <FAB
              accessibilityLabel="Take a picture"
              icon={(props) => <MaterialCommunityIcons name="camera-image" {...props} />}
              onPress={takeAPicture}
              style={[styles.fabImportant, styles.largeFab]}
            />
            <FAB
              accessibilityLabel="Show picture"
              disabled
              icon={(props) => <MaterialCommunityIcons name="image" {...props} />}
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
