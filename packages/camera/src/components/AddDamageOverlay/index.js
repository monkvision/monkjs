import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
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
  const effectiveInnerHeight = useMemo(
    () => (innerHeight > height * 0.75 ? height * 0.75 : innerHeight),
    [height, innerHeight],
  );
  const effectiveInnerWidth = useMemo(
    () => (innerWidth > width * 0.68 ? width * 0.68 : innerWidth),
    [height, innerWidth],
  );

  return (
    <>
      <View style={[
        styles.overlay,
        {
          top: 0,
          left: 0,
          right: 0,
          bottom: effectiveInnerHeight + (height - effectiveInnerHeight) / 2,
        },
      ]}
      />
      <View style={[
        styles.overlay,
        {
          top: effectiveInnerHeight + (height - effectiveInnerHeight) / 2,
          left: 0,
          right: 0,
          bottom: 0,
        },
      ]}
      />
      <View style={[
        styles.overlay,
        {
          top: (height - effectiveInnerHeight) / 2,
          left: 0,
          right: effectiveInnerWidth + (width - effectiveInnerWidth) / 2,
          bottom: (height - effectiveInnerHeight) / 2,
        },
      ]}
      />
      <View style={[
        styles.overlay,
        {
          top: (height - effectiveInnerHeight) / 2,
          left: effectiveInnerWidth + (width - effectiveInnerWidth) / 2,
          right: 0,
          bottom: (height - effectiveInnerHeight) / 2,
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
