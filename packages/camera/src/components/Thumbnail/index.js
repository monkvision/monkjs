import React from 'react';
import PropTypes from 'prop-types';

import '@expo/match-media';
import { useMediaQuery } from 'react-responsive';
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
    borderBottomWidth: 1.5,
    opacity: 0.5,
  },
  smRoot: {
    width: 100,
    height: 100,
  },
  smOverlay: {
    height: 75,
    width: 100,
  },
  smPicture: {
    height: 75,
    width: 100,
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
  style,
  uploadStatus,
  ...passThroughProps
}) {
  const isSmallScreen = useMediaQuery({ maxWidth: 720 });

  return (
    <View
      style={[
        styles.root,
        { borderColor: colorsVariant(colors)[uploadStatus] },
        isSmallScreen ? styles.smRoot : undefined,
        style,
      ]}
      {...passThroughProps}
    >
      {picture !== null && (
        <Image
          alt={`Picture of ${label} sight`}
          source={picture}
          style={[
            styles.picture,
            { borderColor: colorsVariant(colors)[uploadStatus] },
            isSmallScreen ? styles.smPicture : undefined,
          ]}
        />
      )}
      <Overlay
        svg={overlay}
        style={[
          styles.overlay,
          isSmallScreen ? styles.smOverlay : undefined,
        ]}
        label={label}
      />
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
