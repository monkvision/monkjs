import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

import { spacing } from 'config/theme';

import { Platform, StyleSheet, Text, View } from 'react-native';
import Loader from 'components/Loader';

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
    margin: spacing(1),
  },
});

export default function Loading({ text }) {
  return (
    <View style={styles.root}>
      <Loader width={100} height={100} />
      {!isEmpty(text) ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}

Loading.propTypes = {
  text: PropTypes.string,
};

Loading.defaultProps = {
  text: 'Loading...',
};
