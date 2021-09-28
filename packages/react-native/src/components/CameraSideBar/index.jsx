import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    ...Platform.select({
      native: { width: 100 },
      default: { width: 150 },
    }),
  },
});

/**
 * @param children {node}
 * @param passThroughProps
 * @returns {JSX.Element}
 * @constructor
 */
function CameraSideBar({ children, ...passThroughProps }) {
  return (
    <View style={styles.root} {...passThroughProps}>
      {children}
    </View>
  );
}

export default CameraSideBar;
