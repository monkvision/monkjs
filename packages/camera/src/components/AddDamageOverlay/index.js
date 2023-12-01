import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View, Platform } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    ...Platform.select({
      web: {
        position: 'fixed'
      },
      native: {
        position: 'static'
      }
    }),
    margin: 'auto',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    boxShadow: '0 0 0 100pc #00000080',
  },
});

export default function AddDamageOverlay({ innerWidth, innerHeight }) {
  const { width, height } = useWindowDimensions();
  const effectiveInnerHeight = useMemo(
    () => (innerHeight > height * 0.75 ? innerHeight : height * 0.75),
    [height, innerHeight],
  );
  const effectiveInnerWidth = useMemo(
    () => (innerWidth > width * 0.68 ? innerWidth : width * 0.68),
    [width, innerWidth],
  );

  return (
    <View style={[
      styles.overlay,
      {
        height: effectiveInnerHeight - (height - effectiveInnerHeight) / 2,
        width: effectiveInnerWidth - (width - effectiveInnerWidth) / 2,
      },
    ]}
    />
  );
}

AddDamageOverlay.propTypes = {
  innerHeight: PropTypes.number,
  innerWidth: PropTypes.number,
};

AddDamageOverlay.defaultProps = {
  innerHeight: 300,
  innerWidth: 400,
};
