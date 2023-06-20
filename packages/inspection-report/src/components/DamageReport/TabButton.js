import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
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
  selectedContainer: {
    backgroundColor: '#414659',
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
  },
  icon: {
    marginRight: 5,
  },
  left: {
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  right: {
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
});

function TabButton({ color, icon, label, selected, onPress, position }) {
  const { width } = useWindowDimensions();
  const maxWidth = useMemo(() => (width / 2) - 25, [width]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { maxWidth },
        styles[position],
        selected ? styles.selectedContainer : null,
      ]}
      disabled={selected}
      onPress={onPress}
    >
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
  position: PropTypes.oneOf(['left', 'center', 'right']),
  selected: PropTypes.bool,
};
TabButton.defaultProps = {
  color: '#ffffff',
  icon: '',
  label: '',
  onPress: () => {},
  position: 'center',
  selected: false,
};

export default TabButton;
