import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

import { spacing } from 'config/theme';

import { StyleSheet, View } from 'react-native';
import { utils } from '@monkvision/react-native';
import { Text } from 'react-native-paper';

import Loader from 'components/Loader';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
    flexDirection: 'column',
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
  text: 'Loading',
};
