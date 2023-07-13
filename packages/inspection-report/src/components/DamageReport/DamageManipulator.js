/* eslint-disable react/no-unescaped-entities */
import Slider from '@react-native-community/slider';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSeverity, SeveritiesWithIcon } from '../../assets';
import { CommonPropTypes, DamageMode, DisplayMode, Severity, RepairOperation } from '../../resources';
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
  severityUneditable: {
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const initialDamage = {
  pricing: 1,
  repairOperation: RepairOperation.REPAIR,
  severity: Severity.LOW,
};

const replaceDamage = {
  pricing: 0,
  repairOperation: RepairOperation.REPLACE,
  severity: Severity.HIGH,
};

export default function DamageManipulator({
  damageMode,
  displayMode,
  onConfirm,
  damage,
  onToggleDamage,
  isEditable,
}) {
  const { t } = useTranslation();
  const [isReplaced, setReplaced] = useState(damage?.repairOperation === RepairOperation.REPLACE);
  const [hasDamage, setHasDamage] = useState(!!damage);
  const [editedDamage, setEditedDamage] = useState(damage);

  const toggleReplaceSwitch = useCallback(() => {
    const newIsReplaced = !isReplaced;
    setReplaced(newIsReplaced);
    setEditedDamage((prevState) => ({
      ...(prevState ?? {}),
      ...(newIsReplaced ? replaceDamage : initialDamage),
    }));
  }, [isReplaced, editedDamage]);

  const toggleDamageSwitch = useCallback(() => {
    const newHasDamage = !hasDamage;
    onToggleDamage(newHasDamage);
    setHasDamage(newHasDamage);
    setReplaced((prevState) => (newHasDamage ? prevState : false));
    setEditedDamage((prevState) => ({
      ...(prevState ?? {}),
      ...initialDamage,
      pricing: newHasDamage ? (prevState?.pricing ?? initialDamage?.pricing) : 0,
      severity: newHasDamage ? (prevState?.severity ?? initialDamage?.severity) : undefined,
    }));
  }, [onToggleDamage, hasDamage, editedDamage, damageMode]);

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
            {t(`damageManipulator.${hasDamage ? 'damaged' : 'notDamaged'}`)}
          </Text>
        </View>
        {isEditable && (
          <SwitchButton isEnabled={hasDamage} onPress={toggleDamageSwitch} />
        )}
      </View>
      {
        ([DamageMode.SEVERITY, DamageMode.ALL].includes(damageMode)
        && displayMode === DisplayMode.FULL) && (
          <View style={[
            styles.content,
            (displayMode === DisplayMode.FULL && !hasDamage) && styles.disabled,
          ]}
          >
            <View>
              <Text style={[styles.text, styles.smallText]}>{t('damageManipulator.damages')}</Text>
              <Text style={[styles.text, styles.subtitle]}>
                {t(`damageManipulator.${isReplaced ? 'replaced' : 'notReplaced'}`)}
              </Text>
            </View>
            {isEditable && (
              <SwitchButton
                isEnabled={isReplaced}
                disabled={displayMode === DisplayMode.FULL && !hasDamage}
                onPress={toggleReplaceSwitch}
              />
            )}
          </View>
        )
      }
      {
        ([DamageMode.SEVERITY, DamageMode.ALL].includes(damageMode)
        && displayMode === DisplayMode.FULL) && (
          <View style={[
            styles.content,
            styles.columnContent,
            (displayMode === DisplayMode.FULL && (!hasDamage || isReplaced)) && styles.disabled,
          ]}
          >
            <Text style={[styles.text, styles.smallText]}>{t('damageManipulator.severity')}</Text>
            {isEditable ? (
              <View style={[styles.severityContent]}>
                {Object.values(SeveritiesWithIcon).map((severity) => (
                  <TouchableOpacity
                    key={severity.key}
                    style={[styles.severityButtonWrapper, getHighlightStyle(severity.key)]}
                    onPress={() => setEditedDamage((dmg) => ({ ...dmg, severity: severity.key }))}
                    disabled={displayMode === DisplayMode.FULL && (!hasDamage || isReplaced)}
                  >
                    {editedDamage?.severity === severity.key && (
                      <severity.Icon style={{ marginRight: 5 }} />
                    )}
                    <Text style={[styles.text, styles.subtitle]}>{t(`severityLabels.${severity.key}`)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={[styles.severityUneditable]}>
                <IconSeverity severity={editedDamage?.severity} style={{ marginRight: 10 }} />
                <Text style={[styles.text, styles.subtitle]}>{t(`severityLabels.${editedDamage?.severity}`)}</Text>
              </View>
            )}
          </View>
        )
      }
      {
        ([DamageMode.PRICING, DamageMode.ALL].includes(damageMode)
        && displayMode === DisplayMode.FULL) && (
          <View style={[
            styles.content,
            styles.columnContent,
            (displayMode === DisplayMode.FULL && (!hasDamage || isReplaced)) && styles.disabled,
          ]}
          >
            <Text style={[styles.text, styles.smallText]}>{t('damageManipulator.repairCost')}</Text>
            {isEditable ? (
              <View style={[styles.severityContent]}>
                <Slider
                  style={{ marginRight: 15 }}
                  minimumValue={0}
                  maximumValue={1500}
                  lowerLimit={0}
                  upperLimit={1500}
                  step={20}
                  disabled={displayMode === DisplayMode.FULL && (!hasDamage || isReplaced)}
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
            ) : (
              <Text style={[styles.text]}>
                {editedDamage?.pricing ?? 0}
                €
              </Text>
            )}
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
  isEditable: PropTypes.bool,
  onConfirm: PropTypes.func,
  onToggleDamage: PropTypes.func,
};

DamageManipulator.defaultProps = {
  damage: undefined,
  damageMode: DamageMode.ALL,
  displayMode: DisplayMode.MINIMAL,
  isEditable: true,
  onConfirm: () => {},
  onToggleDamage: () => {},
};
