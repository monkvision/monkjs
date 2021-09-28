import React from 'react';

import utils from 'components/utils';

import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
  },
});

export default function ActivityIndicatorScreen() {
  return (
    <View style={styles.root}>
      <ActivityIndicator />
    </View>
  );
}
