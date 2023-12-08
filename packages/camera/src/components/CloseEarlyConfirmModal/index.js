import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    backgroundColor: '#000000B3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    paddingTop: 5,
    backgroundColor: '#282830',
    borderRadius: 20,
    flexDirection: 'column',
    maxWidth: 400,
  },
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  body: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  footer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  message: {
    fontSize: 18,
    color: '#f1f1f1',
  },
  closeBtn: {
    padding: 15,
  },
  closeBtnTxt: {
    fontSize: 20,
    color: '#f1f1f1',
  },
  modalBtn: {
    padding: 15,
    marginLeft: 20,
  },
  modalBtnTxt: {
    fontSize: 18,
    color: '#f1f1f1',
  },
});

export default function CloseEarlyConfirmModal({ confirmationMessage, onConfirm, onCancel }) {
  const { width, height } = useWindowDimensions();
  const { i18n, t } = useTranslation();

  const displayedMessage = useMemo(
    () => confirmationMessage[i18n.language],
    [confirmationMessage, i18n.language],
  );

  return (
    <View style={[styles.backdrop, { width, height }]}>
      <View style={[styles.container]}>
        <View style={[styles.header]}>
          <TouchableOpacity style={[styles.closeBtn]} onPress={onCancel}>
            <Text style={[styles.closeBtnTxt]}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.body]}>
          <Text style={[styles.message]}>
            {displayedMessage}
          </Text>
        </View>
        <View style={[styles.footer]}>
          <TouchableOpacity style={[styles.modalBtn]} onPress={onCancel}>
            <Text style={[styles.modalBtnTxt]}>{t('closeEarlyModal.cancel')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modalBtn]} onPress={onConfirm}>
            <Text style={[styles.modalBtnTxt]}>{t('closeEarlyModal.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

CloseEarlyConfirmModal.propTypes = {
  confirmationMessage: PropTypes.shape({
    de: PropTypes.string.isRequired,
    en: PropTypes.string.isRequired,
    fr: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

CloseEarlyConfirmModal.defaultProps = {
  onCancel: () => {},
  onConfirm: () => {},
};
