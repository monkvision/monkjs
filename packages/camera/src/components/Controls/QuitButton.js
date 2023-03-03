import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native';

export default function QuitButton() {
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
      <MaterialCommunityIcons name="exit-to-app" size={24} />
    </Text>
  );
}
