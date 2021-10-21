/* eslint-disable import/no-dynamic-require, global-require */
import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';
import kebabCase from 'lodash.kebabcase';
import utils from '../utils';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
  },
  image: {
    ...utils.styles.getContainedSizes('4:3'),
  },
});

export default function Mask({ id, ...props }) {
  return (
    <View style={styles.root}>
      <Image
        alt={id}
        source={{ uri: require(`../../assets/sightMasks/${kebabCase(id)}.svg`) }}
        style={styles.image}
        {...props}
      />
    </View>
  );
}

Mask.propTypes = {
  id: PropTypes.string.isRequired,
};
