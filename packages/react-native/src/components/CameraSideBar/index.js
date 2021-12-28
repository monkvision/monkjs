import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    width: 125,
  },
});

/**
 * @param children
 * @param style
 * @param passThroughProps
 * @returns {JSX.Element}
 * @constructor
 */
function CameraSideBar({ children, style, ...passThroughProps }) {
  return (
    <View style={[styles.root, style]} {...passThroughProps}>
      {children}
    </View>
  );
}

export default CameraSideBar;
