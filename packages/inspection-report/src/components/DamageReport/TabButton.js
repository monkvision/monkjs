import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    width: 170,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
});

function TabButton({ color, icon, label, selected, onPress }) {
  return (
    <TouchableOpacity style={[styles.container]} onPress={onPress}>
      <MaterialIcons style={[styles.icon]} name={selected ? 'check' : icon} size={24} color={color} />
      <Text style={[styles.text]}>{label}</Text>
    </TouchableOpacity>
  );
}

TabButton.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  onPress: PropTypes.func,
  selected: PropTypes.bool,
};
TabButton.defaultProps = {
  color: '#ffffff',
  icon: '',
  label: '',
  onPress: () => {},
  selected: false,
};

export default TabButton;
