import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { CarOrientation, useCarOrientation } from '@monkvision/inspection-report';
import { RotateLeft, RotateRight } from './assets';
import { sightCarOrientationMap, usePartSelector } from './hooks';
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
    maxHeight: 400,
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
  buttonCompact: {
    paddingVertical: 7,
    paddingHorizontal: 12,
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
  vehicleType,
}) {
  const { togglePart, isPartSelected, selectedParts } = usePartSelector();
  const { t } = useTranslation();
  const {
    orientation,
    rotateLeft,
    rotateRight,
  } = useCarOrientation(sightCarOrientationMap[currentSight] ?? CarOrientation.FRONT_LEFT);
  const { height: windowHeight } = useWindowDimensions();
  const isCompact = useMemo(() => (windowHeight < 370), [windowHeight]);

  const rotateButtonDimensions = useMemo(() => ({
    height: 37,
    width: 16,
  }), []);
  const isConfirmDisabled = useMemo(() => selectedParts.length === 0, [selectedParts]);

  return (
    <View style={[styles.container, isCompact ? { paddingVertical: 3 } : {}]}>
      <View style={[styles.header, isCompact ? { marginBottom: 0 } : {}]}>
        <Text style={[styles.text, styles.title]}>
          {t('partSelector.modal.title')}
        </Text>
        <TouchableOpacity style={[styles.closeBtn]} onPress={onCancel}>
          <Text style={[styles.text]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>
      {isCompact ? null : (
        <View style={[styles.subheader]}>
          <Text style={[styles.text]}>
            {t('partSelector.modal.subtitle')}
          </Text>
        </View>
      )}
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
          togglePart={togglePart}
          isPartSelected={isPartSelected}
          vehicleType={vehicleType}
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
        <TouchableOpacity
          style={[styles.button, isCompact ? styles.buttonCompact : {}]}
          onPress={onCancel}
        >
          <Text style={[styles.text]}>
            {t('partSelector.modal.cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isCompact ? styles.buttonCompact : {}]}
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
  vehicleType: PropTypes.oneOf([
    'suv',
    'cuv',
    'sedan',
    'hatchback',
    'van',
    'minivan',
    'pickup',
  ]),
};

AddDamageModal.defaultProps = {
  onCancel: () => {},
  onConfirm: () => {},
  vehicleType: 'cuv',
};
