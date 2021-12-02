import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';
import Components, { propTypes } from '@monkvision/react-native';

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#333',
  },
  takePictureButton: {
    backgroundColor: '#fff',
  },
  takePictureButtonContainer: {
    display: 'flex',
    borderRadius: 100,
    padding: 4,
    borderColor: '#fff',
    borderStyle: 'solid',
    borderWidth: 2,
    transform: [{ scale: 1.40 }],
  },
});

function CameraControls({ fakeActivity, onLeave, onSettings, onTakePicture }) {
  return (
    <Components.CameraSideBar>
      <FAB
        accessibilityLabel="Advices"
        disabled
        icon={Platform.OS !== 'ios' ? 'cog' : undefined}
        label={Platform.OS === 'ios' ? 'Settings' : undefined}
        onPress={onSettings}
        small
        style={styles.fab}
      />
      <View style={styles.takePictureButtonContainer}>
        <FAB
          accessibilityLabel="Take a picture"
          disabled={fakeActivity}
          onPress={onTakePicture}
          style={styles.takePictureButton}
        />
      </View>
      <FAB
        accessibilityLabel="Close camera"
        disabled={fakeActivity}
        icon={Platform.OS !== 'ios' ? 'close' : undefined}
        label={Platform.OS === 'ios' ? 'Close' : undefined}
        onPress={onLeave}
        small
        style={styles.fab}
      />
    </Components.CameraSideBar>
  );
}

CameraControls.propTypes = {
  fakeActivity: PropTypes.bool.isRequired,
  onLeave: propTypes.callback.isRequired,
  onSettings: propTypes.callback.isRequired,
  onTakePicture: propTypes.callback.isRequired,
};

export default withTheme(CameraControls);
