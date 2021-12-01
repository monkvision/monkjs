import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { FAB, withTheme } from 'react-native-paper';
import Components, { propTypes } from '@monkvision/react-native';

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#333',
  },
  fabImportant: {
    backgroundColor: 'white',
  },
  largeFab: {
    transform: [{ scale: 1.75 }],
  },
});

function CameraControls({ fakeActivity, onLeave, onShowAdvices, onTakePicture }) {
  return (
    <Components.CameraSideBar>
      <FAB
        accessibilityLabel="Advices"
        color="#edab25"
        disabled={fakeActivity}
        icon={Platform.OS !== 'ios' ? 'lightbulb-on' : undefined}
        label={Platform.OS === 'ios' ? 'Advices' : undefined}
        onPress={onShowAdvices}
        small
        style={styles.fab}
      />
      <FAB
        accessibilityLabel="Take a picture"
        disabled={fakeActivity}
        icon="camera-image"
        onPress={onTakePicture}
        style={[styles.fabImportant, styles.largeFab]}
      />
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
  onShowAdvices: propTypes.callback.isRequired,
  onTakePicture: propTypes.callback.isRequired,
};

export default withTheme(CameraControls);
