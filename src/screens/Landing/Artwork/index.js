import React from 'react';
import { View } from 'react-native';
import { Drawing } from '@monkvision/ui';
import { Title } from 'react-native-paper';

import artwork from './artwork.svg';
import monk from './monk.svg';
import styles from './styles';

export default function Artwork() {
  return (
    <View style={styles.root}>
      <Drawing xml={artwork} alt="artwork" width={250} height={183} />
      <Title style={styles.title}>Inspect your car with</Title>
      <Drawing xml={monk} alt="artwork" width={120} height={32} />
    </View>
  );
}
