import React from 'react';
import { StyleSheet, View, ActivityIndicator as RNAI } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
  },
});

export default function ActivityIndicator({ show }) {
  if (!show) { return null; }
  return (
    <View style={styles.root}>
      <RNAI />
    </View>
  );
}

ActivityIndicator.propTypes = {
  show: PropTypes.bool,
};
ActivityIndicator.defaultProps = {
  show: false,
};
