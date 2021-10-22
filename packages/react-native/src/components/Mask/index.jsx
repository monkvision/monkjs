import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';

import * as sightMasks from '../../assets/sightMasks';
import utils from '../utils';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
    width: '100%',
    height: '100%',
  },
});

export default function Mask({ id, style, ...props }) {
  const source = useMemo(() => sightMasks[id], [id]);

  return (
    <View style={styles.root}>
      <Image
        source={source}
        style={{ ...utils.styles.getContainedSizes('4:3') }}
        {...props}
      />
    </View>
  );
}

Mask.propTypes = {
  id: PropTypes.string.isRequired,
};
