import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import upperFirst from 'lodash.upperfirst';
import * as sightMasks from '../SightMasks';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
});

export default function Mask({ id, style, ...props }) {
  const Svg = useMemo(() => sightMasks[upperFirst(id)], [id]);

  return (
    <View style={styles.root}>
      <Svg {...props} />
    </View>
  );
}

Mask.propTypes = {
  id: PropTypes.string.isRequired,
};
