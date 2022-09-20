import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native';

export default function CustomCaptureButton({ label, customStyle }) {
  return (
    <Text
      style={[{
        color: '#fff',
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 10,
        textTransform: 'uppercase',
      }, customStyle]}
    >
      {label}
    </Text>
  );
}

CustomCaptureButton.propTypes = {
  customStyle: PropTypes.object,
  label: PropTypes.string.isRequired,
};

CustomCaptureButton.defaultProps = {
  customStyle: {},
};
