/* eslint-disable react/no-unescaped-entities */
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CommonPropTypes, DamageMode, DisplayMode, SeveritiesWithIcon, Severity } from '../../resources';
import { TextButton, SwitchButton } from '../common';

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

const initialDamageMap = {
  [DamageMode.PRICING]: { pricing: 0 },
  [DamageMode.SEVERITY]: { severity: Severity.LOW },
  [DamageMode.ALL]: { pricing: 0, severity: Severity.LOW },
};

export default function DamageManipulator({ damageMode, displayMode, onConfirm, damage }) {
  const { t } = useTranslation();
  const [editedDamage, setEditedDamage] = useState(damage);

  const toggleSwitch = useCallback(() => {
    setEditedDamage((dmg) => (dmg ? null : initialDamageMap[damageMode]));
  }, [editedDamage, damageMode]);

  const onSliderChange = useCallback((value) => {
    if (value) {
      setEditedDamage((dmg) => ({ ...dmg, pricing: value }));
    }
  }, [editedDamage]);

  const doneHandler = useCallback(() => {
    onConfirm(editedDamage);
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
          <Text style={[styles.text, styles.subtitle]}>
            {t(`damageManipulator.${editedDamage ? 'damaged' : 'notDamaged'}`)}
          </Text>
        </View>
        <SwitchButton onPress={toggleSwitch} isEnabled={!!editedDamage} />
      </View>
      {
        ([DamageMode.SEVERITY, DamageMode.ALL].includes(damageMode)
        && displayMode === DisplayMode.FULL) && (
          <View style={[
            styles.content,
            styles.columnContent,
            (displayMode === DisplayMode.FULL && !editedDamage) && styles.disabled,
          ]}
          >
            <Text style={[styles.text, styles.smallText]}>{t('damageManipulator.severity')}</Text>
            <View style={[styles.severityContent]}>
              {Object.values(SeveritiesWithIcon).map((severity) => (
                <TouchableOpacity
                  key={severity.key}
                  style={[styles.severityButtonWrapper, getHighlightStyle(severity.key)]}
                  onPress={() => setEditedDamage((dmg) => ({ ...dmg, severity: severity.key }))}
                  disabled={displayMode === DisplayMode.FULL && !editedDamage}
                >
                  {editedDamage?.severity === severity.key && (
                    <severity.Icon style={{ marginRight: 5 }} />
                  )}
                  <Text style={[styles.text, styles.subtitle]}>{t(`severityLabels.${severity.key}`)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )
      }
      {
        ([DamageMode.PRICING, DamageMode.ALL].includes(damageMode)
        && displayMode === DisplayMode.FULL) && (
          <View style={[
            styles.content,
            styles.columnContent,
            (displayMode === DisplayMode.FULL && !editedDamage) && styles.disabled,
          ]}
          >
            <Text style={[styles.text, styles.smallText]}>{t('damageManipulator.repairCost')}</Text>
            <View style={[styles.severityContent]}>
              <Slider
                style={{ marginRight: 15 }}
                minimumValue={0}
                maximumValue={9999}
                lowerLimit={0}
                upperLimit={9999}
                step={1}
                disabled={displayMode === DisplayMode.FULL && !editedDamage}
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
  damage: CommonPropTypes.damageWithoutPart,
  damageMode: CommonPropTypes.damageMode,
  displayMode: PropTypes.oneOf(Object.values(DisplayMode)),
  onConfirm: PropTypes.func,
};

DamageManipulator.defaultProps = {
  damage: undefined,
  damageMode: DamageMode.ALL,
  displayMode: DisplayMode.MINIMAL,
  onConfirm: () => {},
};
