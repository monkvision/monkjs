import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backgroundColor: '#000000BE',
  },
  confirmPopup: {
    padding: 25,
    paddingBottom: 10,
    borderRadius: 15,
    flexDirection: 'column',
    backgroundColor: '#232429',
  },
  confirmMessage: {
    color: '#ffffff',
    fontSize: 16,
  },
  confirmButtonsContainer: {
    marginTop: 25,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  confirmButton: {
    padding: 10,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
});

export default function ConfirmModal({
  texts,
  onCancel,
  onConfirm,
}) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container]}>
      <View style={[styles.confirmPopup, { width: width - 60 }]}>
        <Text style={[styles.confirmMessage]}>{ t(texts.message) }</Text>
        <View style={[styles.confirmButtonsContainer]}>
          <TouchableOpacity
            style={[styles.confirmButton]}
            onPress={onConfirm}
          >
            <Text style={[styles.confirmButtonText]}>{ t(texts.yes) }</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton]}
            onPress={onCancel}
          >
            <Text style={[styles.confirmButtonText]}>{ t(texts.cancel) }</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

ConfirmModal.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  texts: PropTypes.shape({
    cancel: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    yes: PropTypes.string.isRequired,
  }).isRequired,
};

ConfirmModal.defaultProps = {
  onCancel: () => {},
  onConfirm: () => {},
};
