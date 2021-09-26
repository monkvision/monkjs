import React from 'react';
import PropTypes from 'prop-types';

import { View as NativeView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'react-native-paper';
import { spacing } from 'config/theme';

const styles = StyleSheet.create({
  root: {
    padding: spacing(2),
  },
});

export default function View({ children, statusBarProps, ...viewProps }) {
  const { colors } = useTheme();

  return (
    <NativeView {...viewProps} style={styles.root}>
      <StatusBar
        style="light"
        backgroundColor={colors['--ifm-color-primary-darkest']}
        {...statusBarProps}
      />
      {children}
    </NativeView>
  );
}

View.propTypes = {
  statusBarProps: PropTypes.objectOf(PropTypes.any),
};

View.defaultProps = {
  statusBarProps: {},
};
