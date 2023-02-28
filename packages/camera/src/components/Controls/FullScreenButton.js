import PropTypes from 'prop-types';
import React from 'react';
import { Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FullScreenButton({ isInFullScreenMode }) {
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
      <MaterialCommunityIcons name={isInFullScreenMode ? 'fullscreen-exit' : 'fullscreen'} size={24} />
    </Text>
  );
}

FullScreenButton.propTypes = {
  isInFullScreenMode: PropTypes.bool,
};

FullScreenButton.defaultProps = {
  isInFullScreenMode: true,
};
