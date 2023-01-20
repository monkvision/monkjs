import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: '#00000080',
  },
});

export default function AddDamageOverlay({ innerWidth, innerHeight }) {
  const { width, height } = useWindowDimensions();

  return (
    <>
      <View style={[
        styles.overlay,
        { top: 0, left: 0, right: 0, bottom: innerHeight + (height - innerHeight) / 2 },
      ]}
      />
      <View style={[
        styles.overlay,
        { top: innerHeight + (height - innerHeight) / 2, left: 0, right: 0, bottom: 0 },
      ]}
      />
      <View style={[
        styles.overlay,
        {
          top: (height - innerHeight) / 2,
          left: 0,
          right: innerWidth + (width - innerWidth) / 2,
          bottom: (height - innerHeight) / 2,
        },
      ]}
      />
      <View style={[
        styles.overlay,
        {
          top: (height - innerHeight) / 2,
          left: innerWidth + (width - innerWidth) / 2,
          right: 0,
          bottom: (height - innerHeight) / 2,
        },
      ]}
      />
    </>
  );
}

AddDamageOverlay.propTypes = {
  innerHeight: PropTypes.number,
  innerWidth: PropTypes.number,
};

AddDamageOverlay.defaultProps = {
  innerHeight: 300,
  innerWidth: 450,
};
