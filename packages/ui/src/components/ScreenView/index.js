import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import {
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { useTheme } from 'react-native-paper';
import { utils } from '@monkvision/toolkit';

const { spacing } = utils.styles;
const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
});

export default function ScreenView({
  children, onRefresh, refreshing, scrollViewProps, statusBarProps, style, ...viewProps
}) {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const showRefreshControl = useMemo(
    () => refreshing && Boolean(onRefresh),
    [onRefresh, refreshing],
  );

  return (
    <SafeAreaView
      {...viewProps}
      style={[styles.root, { height, backgroundColor: colors.background }, style]}
    >
      <ScrollView
        refreshControl={showRefreshControl && (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
        scrollIndicatorInsets={{
          top: spacing(2),
          left: 0,
          bottom: 0,
          right: 0,
        }}
        {...scrollViewProps}
      >
        <StatusBar
          style="light"
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
  scrollViewProps: PropTypes.shape({ style: PropTypes.string }),
  statusBarProps: PropTypes.shape({ style: PropTypes.string }),
};

ScreenView.defaultProps = {
  onRefresh: noop,
  refreshing: false,
  scrollViewProps: {},
  statusBarProps: {},
};
