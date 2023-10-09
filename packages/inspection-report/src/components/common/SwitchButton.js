import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  switchContainer: {
    borderColor: '#5d5e67',
    borderRadius: 16,
    borderWidth: 2,
    height: 32,
    width: 52,
  },
  activeSwitchContainer: {
    backgroundColor: '#8da8ff',
    borderColor: '#8da8ff',
  },
  switch: {
    backgroundColor: '#5d5e67',
    borderRadius: 16,
    height: 24,
    left: 3,
    position: 'absolute',
    top: 2,
    width: 24,
  },
  activeSwitch: {
    backgroundColor: '#003dab',
    left: 23,
  },
});

function SwitchButton({ onPress, isEnabled, disabled }) {
  return (
    <Pressable disabled={disabled} onPress={onPress}>
      <View style={[styles.switchContainer, isEnabled && styles.activeSwitchContainer]}>
        <View style={[styles.switch, isEnabled && styles.activeSwitch]} />
      </View>
    </Pressable>
  );
}

SwitchButton.propTypes = {
  disabled: PropTypes.bool,
  isEnabled: PropTypes.bool,
  onPress: PropTypes.func,
};

SwitchButton.defaultProps = {
  disabled: false,
  isEnabled: false,
  onPress: () => { },
};

export default SwitchButton;
