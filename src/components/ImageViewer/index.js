import React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Dialog, Portal } from 'react-native-paper';
import { DamageHighlight } from '@monkvision/visualization';

const {
  width,
} = Dimensions.get('window');

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'black',
  },
  content: {
    alignItems: 'center',
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
  handleDismiss,
  image,
  isOpen,
  polygons,
}) {
  if (!image || !polygons) {
    return null;
  }

  return (
    <Portal>
      <Dialog
        visible={Boolean(isOpen)}
        onDismiss={handleDismiss}
        styles={styles.dialog}
      >
        <Dialog.Actions>
          <Button icon="close" onPress={handleDismiss} />
        </Dialog.Actions>
        <Dialog.Content style={styles.content}>
          <DamageHighlight
            style={styles.footerContainer}
            image={image}
            polygons={polygons}
            backgroundOpacity={1}
            polygonsProps={{
              opacity: 1,
              stroke: {
                color: '#ec00ff',
                strokeWidth: 2,
              },
            }}
            touchable
            width={width * 0.8}
          />
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

CustomDialog.propTypes = {
  handleDismiss: PropTypes.func.isRequired,
  image: PropTypes.shape({ url: PropTypes.string }).isRequired,
  isOpen: PropTypes.bool,
  polygons: PropTypes.shape({
    opacity: PropTypes.number,
    stroke: PropTypes.shape({
      color: PropTypes.string,
      strokeWidth: PropTypes.number,
    }),
  }),
};

CustomDialog.defaultProps = {
  isOpen: false,
  polygons: [],
};
