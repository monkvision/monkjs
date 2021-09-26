import React from 'react';
import { useNavigation } from '@react-navigation/native';

import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

import Camera from '@monkvision/react-native/src/components/Camera';
import CameraSideBar from '@monkvision/react-native/src/components/CameraSideBar';

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

export default function InspectionsCreate() {
  const navigation = useNavigation();

  const closeCamera = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Inspections');
    }
  };

  const takeAPicture = () => {
    console.warn('Taking picture...');
  };

  const showAdvice = () => {
    console.warn('Showing advice...');
  };

  return (
    <Camera
      rightElements={(
        <CameraSideBar>
          <FAB
            accessibilityLabel="Show advice"
            color="#edab25"
            icon="lightbulb-on"
            onPress={showAdvice}
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
            accessibilityLabel="Close camera"
            icon="close"
            onPress={closeCamera}
            small
            style={styles.fab}
          />
        </CameraSideBar>
      )}
    />
  );
}
