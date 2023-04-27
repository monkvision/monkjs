/* eslint-disable react/no-unescaped-entities */
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import Slider from '@react-native-community/slider';

import { SwitchButton, TextButton } from './index';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  columnContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  severityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  severityButtonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5d5e67',
    borderRadius: 8,
    borderWidth: 2,
    display: 'flex',
    flexDirection: 'row',
    marginRight: 8,
    minHeight: 58,
  },
  button: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#5d5e67',
    borderRadius: 28,
    borderWidth: 2,
    padding: 10,
  },
  text: {
    fontSize: 14,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
  },
  smallText: {
    opacity: 0.72,
    marginBottom: 5,
  },
  disabled: {
    opacity: 0.5,
  },
});

function DamageManipulator({ damageMode, displayMode, onConfirm, damage }) {
  const { t } = useTranslation();
  const [editedDamage, setEditedDamage] = useState(() => damage);

  const toggleSwitch = useCallback(() => {
    setEditedDamage((dmg) => (dmg ? null : { severity: 'minor', pricing: 0 }));
  }, [editedDamage]);

  const onSliderChange = useCallback((value) => {
    if (value) {
      setEditedDamage((dmg) => ({ ...dmg, pricing: value }));
    }
  }, [editedDamage]);

  const doneHandler = useCallback(() => {
    onConfirm({ severity: editedDamage?.severity, pricing: editedDamage?.pricing });
  }, [editedDamage]);

  const getHighlightStyle = useCallback((severity) => {
    const borderColor = editedDamage?.severity === severity ? '#ffffff' : '#5d5e67';
    return {
      borderColor,
    };
  }, [editedDamage]);

  return (
    <View style={styles.container}>
      <View style={[styles.content]}>
        <View>
          <Text style={[styles.text, styles.smallText]}>{t('damageManipulator.damages')}</Text>
          <Text style={[styles.text, styles.subtitle]}>{t('damageManipulator.notDamaged')}</Text>
        </View>
        <SwitchButton onPress={toggleSwitch} isEnabled={!!editedDamage} />
      </View>
      {
        (damageMode === 'severity' || damageMode === 'all') && (displayMode === 'full') && (
          <View style={[styles.content, styles.columnContent, (displayMode === 'full' && !editedDamage) && styles.disabled]}>
            <Text style={[styles.text, styles.smallText]}>{t('damageManipulator.severity')}</Text>
            <View style={[styles.severityContent]}>
              <TouchableOpacity
                style={[styles.severityButtonWrapper, getHighlightStyle('minor')]}
                onPress={() => setEditedDamage((dmg) => ({ ...dmg, severity: 'minor' }))}
                disabled={displayMode === 'full' && !editedDamage}
              >
                {
                  editedDamage?.severity === 'minor' && <MaterialIcons name="trip-origin" size={24} color="#64b5f6" style={{ marginRight: 5 }} />
                }
                <Text style={[styles.text, styles.subtitle]}>{t('damageManipulator.minor')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.severityButtonWrapper, getHighlightStyle('moderate')]}
                onPress={() => setEditedDamage((dmg) => ({ ...dmg, severity: 'moderate' }))}
                disabled={displayMode === 'full' && !editedDamage}
              >
                {
                  editedDamage?.severity === 'moderate' && <MaterialCommunityIcons name="circle-half-full" size={24} color="#d4e157" style={{ marginRight: 5 }} />
                }
                <Text style={[styles.text, styles.subtitle]}>{t('damageManipulator.moderate')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.severityButtonWrapper, getHighlightStyle('major')]}
                onPress={() => setEditedDamage((dmg) => ({ ...dmg, severity: 'major' }))}
                disabled={displayMode === 'full' && !editedDamage}
              >
                {
                  editedDamage?.severity === 'major' && <MaterialIcons name="circle" size={24} color="#64b5f6" style={{ marginRight: 5 }} />
                }
                <Text style={[styles.text, styles.subtitle]}>{t('damageManipulator.major')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      }
      {
        (damageMode === 'pricing' || damageMode === 'all') && (displayMode === 'full') && (
          <View style={[styles.content, styles.columnContent, (displayMode === 'full' && !editedDamage) && styles.disabled]}>
            <Text style={[styles.text, styles.smallText]}>{t('damageManipulator.repairCost')}</Text>
            <View style={[styles.severityContent]}>
              <Slider
                style={{ marginRight: 15 }}
                minimumValue={0}
                maximumValue={9999}
                lowerLimit={0}
                upperLimit={9999}
                step={1}
                disabled={displayMode === 'full' && !editedDamage}
                value={editedDamage?.pricing ?? 0}
                thumbTintColor="#8da8ff"
                minimumTrackTintColor="#ffffff"
                maximumTrackTintColor="#5d5e67"
                onValueChange={onSliderChange}
              />
              <Text style={[styles.text]}>
                {editedDamage?.pricing ?? 0}
                €
              </Text>
            </View>
          </View>
        )
      }
      <View style={[styles.content, { marginTop: 8 }]}>
        <TextButton label={t('damageManipulator.done')} onPress={doneHandler} />
      </View>
    </View>
  );
}

DamageManipulator.propTypes = {
  damage: PropTypes.shape({
    pricing: PropTypes.number,
    severity: PropTypes.string,
  }),
  damageMode: PropTypes.string,
  displayMode: PropTypes.string,
  onConfirm: PropTypes.func,
};

DamageManipulator.defaultProps = {
  damage: {
    pricing: 0,
    severity: '',
  },
  damageMode: 'all',
  displayMode: 'minimal',
  onConfirm: () => { },
};

export default DamageManipulator;
