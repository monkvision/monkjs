import React from 'react';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/react-native';

import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    width: '100%',
    height: '100%',
  },
});

export default function ActivityIndicatorView({ hideIndicator }) {
  return (
    <View style={styles.root}>
      {!hideIndicator && <ActivityIndicator color="white" />}
    </View>
  );
}

ActivityIndicatorView.propTypes = {
  hideIndicator: PropTypes.bool,
};

ActivityIndicatorView.defaultProps = {
  hideIndicator: false,
};
