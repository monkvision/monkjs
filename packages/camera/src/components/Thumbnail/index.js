import React from 'react';
import PropTypes from 'prop-types';
import { Image, View, StyleSheet, Text, Platform } from 'react-native';
import Overlay from '../Overlay';

const styles = StyleSheet.create({
  root: {
    width: 125,
    height: 125,
    margin: 8,
    borderRadius: 5,
    borderWidth: 1.5,
    overflow: 'hidden',
    ...Platform.select({
      web: { cursor: 'pointer' },
    }),
  },
  overlay: {
    height: 100,
    width: 125,
  },
  picture: {
    position: 'absolute',
    height: 100,
    width: 125,
    transform: [{ rotateY: '180deg' }],
  },
  text: {
    color: 'white',
    lineHeight: 16,
    fontSize: 10,
    fontFamily: 'monospace',
    textAlign: 'center',
    maxWidth: '100%',
  },
});

const colorsVariant = (colors) => ({
  idle: 'white',
  rejected: colors.error,
  pending: colors.primary,
  fulfilled: colors.primary,
});

export default function Thumbnail({
  colors,
  label,
  overlay,
  picture,
  uploadStatus,
  ...passThroughProps
}) {
  return (
    <View
      style={[styles.root, { borderColor: colorsVariant(colors)[uploadStatus] }]}
      {...passThroughProps}
    >
      {picture !== null && <Image source={picture} style={styles.picture} />}
      <Overlay svg={overlay} style={styles.overlay} label={label} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

Thumbnail.propTypes = {
  colors: PropTypes.shape({
    error: PropTypes.string,
    primary: PropTypes.string,
  }),
  label: PropTypes.string,
  overlay: PropTypes.string,
  picture: PropTypes.shape({
    height: PropTypes.number,
    source: PropTypes.string,
    width: PropTypes.number,
  }),
  uploadStatus: PropTypes.oneOf(['idle', 'pending', 'fulfilled', 'rejected']),
};

Thumbnail.defaultProps = {
  colors: {
    error: '#fa603d',
    primary: '#274b9f',
  },
  label: '',
  picture: null,
  overlay: '',
  uploadStatus: 'idle',
};
