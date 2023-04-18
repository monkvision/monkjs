import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function IconButton({ onPress, icon, color }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialIcons name={icon} size={24} color={color} />
    </TouchableOpacity>
  );
}

IconButton.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

IconButton.defaultProps = {
  color: '#FFFFFF',
  icon: '',
  onPress: () => {},
};

export default IconButton;
