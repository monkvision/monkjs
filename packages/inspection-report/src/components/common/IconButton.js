import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function IconButton({ icon, color, ...passThrough }) {
  return (
    <TouchableOpacity {...passThrough}>
      <MaterialIcons name={icon} size={24} color={color} />
    </TouchableOpacity>
  );
}

IconButton.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
};

IconButton.defaultProps = {
  color: '#FFFFFF',
  icon: '',
};

export default IconButton;
