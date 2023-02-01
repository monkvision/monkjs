import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15172d',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 5,
    maxWidth: 400,
  },
  header: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  text: {
    color: '#fafafa',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
  },
  button: {
    marginLeft: 20,
    padding: 20,
  },
});

export default function AddDamageHelpModal({
  onCancel,
  onConfirm,
}) {
  const { t } = useTranslation();
  const handleCancel = useMemo(() => (typeof onCancel === 'function' ? onCancel : () => {}), [onCancel]);
  const handleConfirm = useMemo(() => (typeof onConfirm === 'function' ? onConfirm : () => {}), [onConfirm]);

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <Text style={[styles.text, styles.title]}>
          {t('partSelector.help.title')}
        </Text>
      </View>
      <View style={[styles.content]}>
        <Text style={[styles.text]}>
          {t('partSelector.help.content')}
        </Text>
      </View>
      <View style={[styles.footer]}>
        <TouchableOpacity style={[styles.button]} onPress={handleCancel}>
          <Text style={[styles.text]}>
            {t('partSelector.help.cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button]} onPress={handleConfirm}>
          <Text style={[styles.text]}>
            {t('partSelector.help.okay')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

AddDamageHelpModal.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

AddDamageHelpModal.defaultProps = {
  onCancel: () => {},
  onConfirm: () => {},
};
