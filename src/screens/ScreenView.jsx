import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'react-native-paper';
import { spacing } from 'config/theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: spacing(2),
    paddingTop: spacing(2),
  },
});

export default function ScreenView({ children, statusBarProps, ...viewProps }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView {...viewProps} style={styles.root}>
      <ScrollView style={styles.scrollView}>
        <StatusBar
          style="light"
          backgroundColor={colors['--ifm-color-primary-darkest']}
          {...statusBarProps}
        />
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

ScreenView.propTypes = {
  statusBarProps: PropTypes.objectOf(PropTypes.any),
};

ScreenView.defaultProps = {
  statusBarProps: {},
};
