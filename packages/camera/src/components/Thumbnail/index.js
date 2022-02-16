import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import '@expo/match-media';
import { useMediaQuery } from 'react-responsive';
import { ActivityIndicator, Image, View, StyleSheet, Text, Platform } from 'react-native';

import Overlay from '../Overlay';

const styles = StyleSheet.create({
  root: {
    width: 125,
    height: 125,
    margin: 8,
    borderRadius: 5,
    borderWidth: 2,
    shadowColor: 'white',
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    ...Platform.select({
      native: { shadowRadius: 2 },
      default: { shadowRadius: '2px 2px' },
    }),
    overflow: 'hidden',
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
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%', translateY: '-50%' }],
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

export default function Thumbnail({
  colors,
  isCurrent,
  label,
  overlay,
  picture,
  style,
  uploadStatus,
  ...passThroughProps
}) {
  const isSmallScreen = useMediaQuery({ maxWidth: 720 });
  const borderColor = useMemo(() => {
    if (isCurrent) { return colors.current; }
    return colors[uploadStatus];
  }, [colors, isCurrent, uploadStatus]);
  console.log(picture);
  return (
    <View
      style={[
        styles.root,
        { borderColor },
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
            { borderColor: colors[uploadStatus], transform: [{ rotateY: picture?.type === 'front' ? 180 : 0 }] },
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
      {uploadStatus === 'pending' ? (
        <ActivityIndicator style={styles.loader} color={colors[uploadStatus]} />
      ) : null}
    </View>
  );
}

Thumbnail.propTypes = {
  colors: PropTypes.shape({
    current: PropTypes.string,
    fulfilled: PropTypes.string,
    idle: PropTypes.string,
    pending: PropTypes.string,
    rejected: PropTypes.string,
  }),
  isCurrent: PropTypes.bool,
  label: PropTypes.string,
  overlay: PropTypes.string,
  picture: PropTypes.shape({
    base64: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    exif: PropTypes.any,
    height: PropTypes.number,
    pictureSizes: PropTypes.arrayOf(PropTypes.string),
    ratio: PropTypes.string,
    source: PropTypes.string,
    type: PropTypes.string,
    uri: PropTypes.string,
    width: PropTypes.number,
    zoom: PropTypes.number,
  }),
  uploadStatus: PropTypes.oneOf(['idle', 'pending', 'fulfilled', 'rejected']),
};

Thumbnail.defaultProps = {
  colors: {
    current: '#ffcc66',
    fulfilled: '#F3F7FE',
    idle: '#F3F7FE',
    pending: '#43494a',
    rejected: '#fa603d',
  },
  isCurrent: false,
  label: '',
  picture: null,
  overlay: '',
  uploadStatus: 'idle',
};
