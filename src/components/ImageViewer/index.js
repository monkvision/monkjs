import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Portal, Dialog, IconButton } from 'react-native-paper';
import ImageView from 'react-native-image-zoom-viewer-fixed';

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'black',
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
  closeButton: {
    borderColor: 'white',
    alignSelf: 'center',
  },
});

export default function CustomDialog({
  deleteButton, handleDismiss, images, index, isOpen,
}) {
  if (!images?.length) { return null; }

  const renderFooter = () => (
    <>
      { deleteButton && deleteButton }
      <IconButton size={46} color="white" style={styles.closeButton} icon="close" onPress={handleDismiss} />
    </>
  );

  return (
    <Portal>
      <Dialog
        visible={Boolean(isOpen)}
        onDismiss={handleDismiss}
        styles={styles.dialog}
      />
      { isOpen && (
      <ImageView
        enableImageZoom
        enableSwipeDown={false}
        imageUrls={images}
        index={index}
        onRequestClose={handleDismiss}
        renderFooter={renderFooter}
        footerContainerStyle={styles.footerContainer}
      />
      ) }
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
