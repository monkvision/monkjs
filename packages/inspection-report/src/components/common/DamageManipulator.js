/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import moderate from './../../assets/moderate.svg';

import SwitchButton from './SwitchButton';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  severityButtonWrapper: {
    alignItems: 'center',
    borderColor: '#5d5e67',
    borderRadius: 8,
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    marginRight: 8,
    padding: 15,
  },
  severityText: {
    fontSize: 16,
    marginLeft: 10,
  },
  damageWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    opacity: '0.72',
  },
  button: {
    borderColor: '#5d5e67',
    borderRadius: 28,
    borderWidth: 2,
    marginTop: 10,
    padding: 10,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5
  },
  moderateIconContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#d4e157',
    borderRadius: 24,
    display: 'flex',
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 3,
    paddingVertical: 5,
    width: 24,
  },
  moderateIcon: {
    backgroundColor: '#000',
    border: 5,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    height: 16,
    width: 8,
  },
});

function DamageManipulator({ damageMode, displayMode, onConfirm, damage }) {
  const { t } = useTranslation();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [severity, setSeverity] = useState('');
  const [pricing, setPricing] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.damageWrapper}>
        <View>
          <Text style={styles.title}>{t('damageManipulator.damages')}</Text>
          <Text style={{ fontSize: 16, lineHeight: 24 }}>{t('damageManipulator.notDamaged')}</Text>
        </View>
        <SwitchButton onPress={toggleSwitch} isEnabled={isEnabled} />
      </View>
      {
        (damageMode === 'severity' || damageMode === 'all') && ((displayMode === 'minimal' && isEnabled) || displayMode === 'full') && (
          <View style={[{ marginVertical: 15 }, (displayMode === 'full' && !isEnabled) && styles.disabled]}>
            <Text style={styles.title}>{t('damageManipulator.severity')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <TouchableOpacity style={styles.severityButtonWrapper} onPress={() => setSeverity('minor')} disabled={displayMode === 'full' && !isEnabled}>
                <MaterialIcons name='trip-origin' size={24} color='#64b5f6' />
                <Text style={styles.severityText}>{t('damageManipulator.minor')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.severityButtonWrapper} onPress={() => setSeverity('moderate')} disabled={displayMode === 'full' && !isEnabled}>
                <View style={styles.moderateIconContainer}>
                  <View style={styles.moderateIcon} />
                </View>
                <Text style={styles.severityText}>{t('damageManipulator.moderate')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.severityButtonWrapper} onPress={() => setSeverity('major')} disabled={displayMode === 'full' && !isEnabled}>
                <MaterialIcons name='circle' size={24} color='#f59896' />
                <Text style={styles.severityText}>{t('damageManipulator.major')}</Text>
              </TouchableOpacity>
            </View>
          </View >
        )
      }
      {
        (damageMode === 'pricing' || damageMode === 'all') && ((displayMode === 'minimal' && isEnabled) || displayMode === 'full') && (
          <View style={[{ marginVertical: 15 }, (displayMode === 'full' && !isEnabled) && styles.disabled]}>
            <Text style={styles.title}>{t('damageManipulator.repairCost')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Slider
                style={{ marginRight: 15 }}
                minimumValue={0}
                maximumValue={9999}
                lowerLimit={0}
                upperLimit={9999}
                step={1}
                disabled={displayMode === 'full' && !isEnabled}
                value={pricing}
                thumbTintColor="#8da8ff"
                minimumTrackTintColor="#5d5e67"
                maximumTrackTintColor="#000000"
                onValueChange={setPricing}
              />
              <Text>{pricing}€</Text>
            </View>
          </View>
        )
      }
      <TouchableOpacity style={styles.button} onPress={() => onConfirm({ severity, pricing })}>
        <Text style={styles.text}>{t('damageManipulator.done')}</Text>
      </TouchableOpacity>
    </View >
  );
}

DamageManipulator.propTypes = {
  damageMode: PropTypes.string,
  displayMode: PropTypes.string,
  onConfirm: PropTypes.func,
  damage: PropTypes.string,
};

DamageManipulator.defaultProps = {
  damageMode: 'all',
  displayMode: 'minimal',
  onConfirm: () => { },
  damage: null
};

export default DamageManipulator;
