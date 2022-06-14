import React from 'react';
import { Image, View } from 'react-native';
import ExpoConstants from 'expo-constants';
import { Title } from 'react-native-paper';

import Svg from './svg';
import styles from './styles';

export default function Artwork() {
  const { theme, logo, companyName } = ExpoConstants.manifest.extra;

  return (
    <View style={styles.root}>
      <Svg palette={theme.palette} />
      <Title style={styles.title}>Inspect your car with</Title>
      <Image
        alt={`Logo of ${companyName}`}
        style={{ width: logo.width, height: logo.height, resizeMode: 'contain' }}
        {...logo}
      />
    </View>
  );
}
