import React from 'react';
import { Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TakePictureButton() {
  return (
    <Text
      style={{
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 12,
        textTransform: 'uppercase',
      }}
    >
      <MaterialCommunityIcons name="camera" size={30} />
    </Text>
  );
}
