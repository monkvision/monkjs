import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import { RotateLeft, RotateRight } from './assets';
import { useCarOrientation, usePartSelector } from './hooks';
import PartSelector from './PartSelector';

const CONTAINER_PADDING = 10;
const ROTATE_BUTTON_PADDING = 5;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15172d',
    borderRadius: 10,
    padding: CONTAINER_PADDING,
    paddingBottom: 5,
  },
  header: {
    alignSelf: 'stretch',
    marginBottom: 5,
    paddingLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subheader: {
    alignSelf: 'stretch',
    marginBottom: 5,
    paddingLeft: 15,
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
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
    fontSize: 14,
  },
  textDisabled: {
    color: '#949494',
    fontSize: 14,
  },
  title: {
    fontSize: 18,
  },
  closeBtn: {
    padding: 5,
    marginRight: 15,
  },
  button: {
    marginLeft: 20,
    padding: 20,
  },
  rotateButtonContainer: {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateButton: {
    padding: ROTATE_BUTTON_PADDING,
  },
});

export default function AddDamageModal({
  currentSight,
  onCancel,
  onConfirm,
}) {
  const { isPartSelected, togglePart, selectedParts } = usePartSelector();
  const { t } = useTranslation();
  const { orientation, rotateLeft, rotateRight } = useCarOrientation(currentSight);

  const rotateButtonDimensions = useMemo(() => ({
    height: 37,
    width: 16,
  }), []);
  const isConfirmDisabled = useMemo(() => selectedParts.length === 0, [selectedParts]);

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <Text style={[styles.text, styles.title]}>
          {t('partSelector.modal.title')}
        </Text>
        <TouchableOpacity style={[styles.closeBtn]} onPress={onCancel}>
          <Text style={[styles.text]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.subheader]}>
        <Text style={[styles.text]}>
          {t('partSelector.modal.subtitle')}
        </Text>
      </View>
      <View style={[styles.content]}>
        <View style={[styles.rotateButtonContainer]}>
          <TouchableOpacity style={[styles.rotateButton]} onPress={rotateLeft}>
            <RotateLeft
              width={rotateButtonDimensions.width}
              height={rotateButtonDimensions.height}
            />
          </TouchableOpacity>
        </View>
        <PartSelector
          orientation={orientation}
          isPartSelected={isPartSelected}
          togglePart={togglePart}
        />
        <View style={[styles.rotateButtonContainer]}>
          <TouchableOpacity style={[styles.rotateButton]} onPress={rotateRight}>
            <RotateRight
              width={rotateButtonDimensions.width}
              height={rotateButtonDimensions.height}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.footer]}>
        <TouchableOpacity style={[styles.button]} onPress={onCancel}>
          <Text style={[styles.text]}>
            {t('partSelector.modal.cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button]}
          onPress={() => onConfirm(selectedParts)}
          disabled={isConfirmDisabled}
        >
          <Text style={[isConfirmDisabled ? styles.textDisabled : styles.text]}>
            {t('partSelector.modal.confirm')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

AddDamageModal.propTypes = {
  currentSight: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

AddDamageModal.defaultProps = {
  onCancel: () => {},
  onConfirm: () => {},
};
