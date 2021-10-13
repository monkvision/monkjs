/* eslint-disable import/no-dynamic-require, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import kebabCase from 'lodash.kebabcase';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
  },
});

export default function Mask({ id, ...props }) {
  return (
    <View style={styles.root}>
      <img
        src={require(`../../assets/sightMasks/${kebabCase(id)}.svg`)}
        alt={id}
        {...props}
      />
    </View>
  );
}

Mask.propTypes = {
  id: PropTypes.string.isRequired,
};
