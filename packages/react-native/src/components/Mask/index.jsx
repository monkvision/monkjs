import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
});

export default function Mask({ alt, xml, ...props }) {
  return (
    <View style={styles.root}>
      <img src={xml} alt={alt} {...props} />
    </View>
  );
}

Mask.propTypes = {
  alt: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
};
