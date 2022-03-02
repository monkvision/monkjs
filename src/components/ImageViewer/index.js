import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Dialog, IconButton, Portal } from 'react-native-paper';
import ImageView from 'react-native-image-zoom-viewer-fixed';

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'black',
    position: 'absolute',
    zIndex: 999,
  },
  footerContainer: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex' },
    }),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  buttonLayout: {
    width: 40,
    height: 40,
    borderRadius: 999,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  closeButtonLayout: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    right: 20,
    top: 20,
  },
  deleteButtonLayout: {
    backgroundColor: '#FFF',
    bottom: 20,
    alignSelf: 'center',
  },
  closeButton: {
    borderColor: 'white',
    alignSelf: 'center',
  },
});

export default function CustomDialog({ deleteButton, handleDismiss, images, index, isOpen }) {
  if (!images?.length) { return null; }

  return (
    <Portal>
      <Dialog
        visible={Boolean(isOpen)}
        onDismiss={handleDismiss}
        styles={styles.dialog}
      />

      {isOpen ? (
        <>
          <View style={[styles.buttonLayout, styles.closeButtonLayout]}>
            <IconButton size={28} color="white" style={styles.closeButton} icon="close" onPress={handleDismiss} />
          </View>

          <ImageView
            enableImageZoom
            enableSwipeDown={false}
            imageUrls={images}
            index={index}
            onRequestClose={handleDismiss}
            // renderFooter={() => deleteButton || null}
            footerContainerStyle={styles.footerContainer}
          />

        </>
      ) : null}
    </Portal>
  );
}

CustomDialog.propTypes = {
  deleteButton: PropTypes.element,
  handleDismiss: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({ url: PropTypes.string })).isRequired,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
};

CustomDialog.defaultProps = {
  index: 0,
  isOpen: false,
  deleteButton: null,
};
