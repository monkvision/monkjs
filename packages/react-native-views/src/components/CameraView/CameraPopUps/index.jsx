import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { propTypes } from '@monkvision/react-native';
import { Snackbar, Text, withTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  advices: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    maxWidth: 512,
    ...Platform.select({
      web: { maxHeight: 512 },
      native: { maxHeight: 300 },
    }),
    alignSelf: 'center',
  },
  snackBar: {
    display: 'flex',
    backgroundColor: 'white',
    alignSelf: 'center',
    ...Platform.select({
      native: { width: 300 },
    }),
  },
});

function CameraPopUps({
  onCloseCamera,
  onDismissSnack,
  snackIsVisible,
  theme,
}) {
  const { colors } = theme;

  return (
    <>
      <Snackbar
        action={{
          label: 'Leave',
          onPress: onCloseCamera,
          color: colors.error,
        }}
        duration={14000}
        onDismiss={onDismissSnack}
        style={styles.snackBar}
        visible={snackIsVisible}
      >
        <Text style={{ color: '#ff9800' }}>
          You are leaving the process, are you sure ?
        </Text>
      </Snackbar>
    </>
  );
}

CameraPopUps.propTypes = {
  onCloseCamera: propTypes.callback.isRequired,
  onDismissSnack: propTypes.callback.isRequired,
  snackIsVisible: PropTypes.bool.isRequired,
};

export default withTheme(CameraPopUps);
