import React from 'react';
import { View, StyleSheet } from 'react-native';

const paddingHorizontal = 16;

const styles = StyleSheet.create({
  root: {
    width: '100%',
    paddingHorizontal,
    marginHorizontal: 'auto',
    maxWidth: 1024 - (2 * paddingHorizontal),
  },
});

export default function Container({ children, style }) {
  return (
    <View style={[styles.root, style]}>
      {children}
    </View>
  );
}
