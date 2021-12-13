import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';
import { propTypes } from '@monkvision/react-native';
import { Snackbar, Text, withTheme, Modal } from 'react-native-paper';
import AdvicesView from '../../AdvicesView';

const styles = StyleSheet.create({
  advices: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    maxWidth: 500,
    backgroundColor: '#000000c1',
    alignSelf: 'center',
    ...Platform.select({
      web: { maxHeight: 360 },
      native: { maxHeight: '96%' },
    }),
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
  onDismissAdvices,
  modalIsVisible,
  theme,
}) {
  const { colors } = theme;

  return (
    <>
      <Modal
        contentContainerStyle={styles.advices}
        style={{ display: 'flex', justifyContent: 'center' }}
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
        <Text style={{ color: '#ff9800' }}>
          You are leaving the process, are you sure ?
        </Text>
      </Snackbar>
    </>
  );
}

CameraPopUps.propTypes = {
  modalIsVisible: PropTypes.bool.isRequired,
  onCloseCamera: propTypes.callback.isRequired,
  onDismissAdvices: propTypes.callback.isRequired,
  onDismissSnack: propTypes.callback.isRequired,
  snackIsVisible: PropTypes.bool.isRequired,
};

export default withTheme(CameraPopUps);
