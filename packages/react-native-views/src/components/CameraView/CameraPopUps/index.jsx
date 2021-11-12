import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { propTypes } from '@monkvision/react-native';
import { Modal, Snackbar, Text, useTheme } from 'react-native-paper';

import AdvicesView from '../../AdvicesView';

const styles = StyleSheet.create({
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
  modalIsVisible,
  onCloseCamera,
  onDismissAdvices,
  onDismissSnack,
  snackIsVisible,
}) {
  const { colors } = useTheme();

  return (
    <>
      <Modal
        contentContainerStyle={styles.advices}
        onDismiss={onDismissAdvices}
        visible={modalIsVisible}
      >
        <AdvicesView onDismiss={onDismissAdvices} />
      </Modal>

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
        <Text style={{ color: colors.warning }}>
          You are leaving the process, are you sure ?
        </Text>
      </Snackbar>
    </>
  );
}

export default CameraPopUps;

CameraPopUps.propTypes = {
  modalIsVisible: PropTypes.bool.isRequired,
  onCloseCamera: propTypes.callback.isRequired,
  onDismissAdvices: propTypes.callback.isRequired,
  onDismissSnack: propTypes.callback.isRequired,
  snackIsVisible: PropTypes.bool.isRequired,
};
