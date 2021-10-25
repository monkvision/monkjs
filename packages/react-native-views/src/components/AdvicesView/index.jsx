import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
});

/**
 * @returns {JSX.Element}
 * @constructor
 */
export default function AdvicesView({ ...props }) {
  return (
    <View style={styles.root} {...props}>
      <Text>
        Advices
      </Text>
    </View>
  );
}
