import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
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

const testMap = {
  0: 'suv',
  1: 'cuv',
  2: 'sedan',
  3: 'hatchback',
  4: 'van',
  5: 'minivan',
  6: 'pickup',
};

export default function AddDamageModal({
  currentSight,
  onCancel,
  onConfirm,
}) {
  const [count, setCount] = useState(0);
  const { togglePart, isPartSelected, selectedParts } = usePartSelector();
  const { t } = useTranslation();
  const { orientation, rotateLeft, rotateRight } = useCarOrientation(currentSight);
  const { height: windowHeight } = useWindowDimensions();
  const isCompact = useMemo(() => (windowHeight < 370), [windowHeight]);

  const rotateButtonDimensions = useMemo(() => ({
    height: 37,
    width: 16,
  }), []);
  const isConfirmDisabled = useMemo(() => selectedParts.length === 0, [selectedParts]);
  const test = useCallback(() => {
    setCount((prev) => (prev + 1 > 6 ? 0 : prev + 1));
  }, [setCount]);

  return (
    <View style={[styles.container, isCompact ? { paddingVertical: 3 } : null]}>
      <View style={[styles.header, isCompact ? { marginBottom: 0 } : null]}>
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
          vehicleType={testMap[count]}
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
          style={[styles.button, { backgroundColor: '#571685', borderRadius: 10 }]}
          onPress={test}
        >
          <Text style={[styles.text]}>
            Switch Vehicle
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isCompact ? styles.buttonCompact : null]}
          onPress={onCancel}
        >
          <Text style={[styles.text]}>
            {t('partSelector.modal.cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isCompact ? styles.buttonCompact : null]}
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
