import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native';

export default function AddDamageButton({ label, customStyle }) {
  return (
    <Text
      testID="addDamageButton"
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

AddDamageButton.propTypes = {
  customStyle: PropTypes.object,
  label: PropTypes.string.isRequired,
};

AddDamageButton.defaultProps = {
  customStyle: {},
};
