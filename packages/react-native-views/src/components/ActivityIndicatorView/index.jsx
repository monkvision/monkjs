import React from 'react';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/react-native';

import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
    width: '100%',
    height: '100%',
  },
});

/**
 * @param hideIndicator {boolean}
 * @param light {boolean}
 * @returns {JSX.Element}
 * @constructor
 */
export default function ActivityIndicatorView({ hideIndicator, light }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root,
      { backgroundColor: `rgba(${light ? '255, 255, 255' : '0, 0, 0'}, 0.5)` }]}
    >
      {!hideIndicator ? <ActivityIndicator color={light ? colors.primary : 'white'} /> : null}
    </View>
  );
}

ActivityIndicatorView.propTypes = {
  hideIndicator: PropTypes.bool,
  light: PropTypes.bool,
};

ActivityIndicatorView.defaultProps = {
  hideIndicator: false,
  light: false,
};
