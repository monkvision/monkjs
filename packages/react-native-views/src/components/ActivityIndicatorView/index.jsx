import React from 'react';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/react-native';

import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Provider, withTheme } from 'react-native-paper';

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
 * @param theme
 * @returns {JSX.Element}
 * @constructor
 */
function ActivityIndicatorView({ hideIndicator, light, theme }) {
  const { colors } = theme;

  return (
    <View
      style={[styles.root, {
        backgroundColor: `rgba(${light ? '255, 255, 255' : '0, 0, 0'}, 0.5)`,
      }]}
    >
      <Provider theme={theme}>
        {!hideIndicator ? <ActivityIndicator color={light ? colors.primary : 'white'} /> : null}
      </Provider>
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

export default withTheme(ActivityIndicatorView);
