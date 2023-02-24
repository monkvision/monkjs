import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FullScreenButton({ label }) {
  return (
    <Text
      style={{
        color: '#FFF',
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 10,
        textTransform: 'uppercase',
      }}
    >
      {
        label === 'fullScreen'
        && <MaterialCommunityIcons name="fullscreen" size={24} />
      }
      {
        label === 'exitFullScreen'
        && <MaterialCommunityIcons name="fullscreen-exit" size={24} />
      }
    </Text>
  );
}

FullScreenButton.propTypes = {
  label: PropTypes.string,
};

FullScreenButton.defaultProps = {
  label: 'fullScreen',
};
