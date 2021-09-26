import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text, Title, useTheme } from 'react-native-paper';

import { spacing } from 'config/theme';
import Drawing from 'components/Drawing';

import svgXml from './undraw_void_3ggu.svg';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      native: {
        flex: 1,
      },
      default: {
        display: 'flex',
        minHeight: '100vh',
      },
    }),
  },
  text: {
    marginBottom: spacing(3),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing(2),
  },
  button: {
    margin: spacing(1),
  },
});

export default function Empty({ createLabel, isFetching, onCreatePress, onRefreshPress }) {
  const { colors } = useTheme();

  const refreshButtonProps = useMemo(() => ({
    children: isFetching ? 'Refreshing' : 'Refresh',
    disabled: isFetching,
    loading: isFetching,
    mode: 'contained',
    icon: 'refresh',
    onPress: onRefreshPress,
    style: styles.button,
  }), [isFetching, onRefreshPress]);

  const createButtonProps = useMemo(() => ({
    mode: 'contained',
    icon: 'plus',
    onPress: onCreatePress,
    style: styles.button,
  }), [onCreatePress]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Title>Empty</Title>
      <Text style={styles.text}>There is no data to display.</Text>
      <View style={styles.buttonContainer}>
        <Button {...refreshButtonProps} />
        <Button {...createButtonProps}>{createLabel}</Button>
      </View>
      <Drawing xml={svgXml} alt="artwork" width={304} height={221} />
    </View>
  );
}

Empty.propTypes = {
  createLabel: PropTypes.string,
  isFetching: PropTypes.bool,
  onCreatePress: PropTypes.func,
  onRefreshPress: PropTypes.func,
};

Empty.defaultProps = {
  createLabel: 'Create',
  isFetching: false,
  onCreatePress: noop,
  onRefreshPress: noop,
};
