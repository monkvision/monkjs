import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { RefreshControl, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'react-native-paper';
import { spacing } from 'config/theme';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingBottom: spacing(2),
  },
  scrollView: {
    paddingTop: spacing(2),
    marginHorizontal: spacing(2),
  },
});

export default function ScreenView({
  children, onRefresh, refreshing, statusBarProps, ...viewProps
}) {
  const { colors } = useTheme();
  const showRefreshControl = useMemo(
    () => refreshing && Boolean(onRefresh),
    [onRefresh, refreshing],
  );

  return (
    <SafeAreaView {...viewProps} style={styles.root}>
      <ScrollView
        refreshControl={showRefreshControl && (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
        style={styles.scrollView}
        scrollIndicatorInsets={{
          top: spacing(2),
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
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
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  statusBarProps: PropTypes.objectOf(PropTypes.any),
};

ScreenView.defaultProps = {
  onRefresh: noop,
  refreshing: false,
  statusBarProps: {},
};
