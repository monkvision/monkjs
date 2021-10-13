import React from 'react';

import utils from '@monkvision/react-native/src/components/utils';

import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    width: '100%',
    height: '100%',
  },
});

export default function ActivityIndicatorView() {
  return (
    <View style={styles.root}>
      <ActivityIndicator color="white" />
    </View>
  );
}
