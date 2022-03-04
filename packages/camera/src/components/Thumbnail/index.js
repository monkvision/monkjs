import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import '@expo/match-media';
import { ActivityIndicator, Image, View, StyleSheet, Text, Platform } from 'react-native';

import { SIDE_WIDTH } from '../Layout';
import Overlay from '../Overlay';

const MARGIN = 8;
const BORDER_WIDTH = 2;
const DEFAULT_RATIO = 3 / 4;
const LENGTH = SIDE_WIDTH - (MARGIN * 2) - BORDER_WIDTH;

const styles = StyleSheet.create({
  root: {
    width: LENGTH,
    height: LENGTH,
    margin: MARGIN,
    borderRadius: 5,
    borderWidth: BORDER_WIDTH,
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
    height: LENGTH * DEFAULT_RATIO,
    width: LENGTH,
  },
  picture: {
    position: 'absolute',
    height: LENGTH * DEFAULT_RATIO,
    width: LENGTH,
    borderBottomWidth: 1.5,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%', translateY: '-50%' }],
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
  onFocus,
  ...passThroughProps
}) {
  const borderColor = useMemo(() => {
    if (isCurrent) { return colors.current; }
    return colors[uploadStatus];
  }, [colors, isCurrent, uploadStatus]);

  useEffect(() => {
    if (isCurrent) { onFocus(SIDE_WIDTH); }
  }, [onFocus, isCurrent]);

  return (
    <View
      style={[styles.root, { borderColor }, style]}
      {...passThroughProps}
    >
      {picture !== null && (
        <Image
          alt={`Picture of ${label} sight`}
          source={picture}
          style={[
            styles.picture,
            {
              shadowColor: colors[uploadStatus],
              borderColor: colors[uploadStatus],
              transform: [{ rotateY: picture?.type === 'front' ? Platform.select({
                native: 180,
                default: '180deg',
              }) : 0 }],
            },
          ]}
        />
      )}
      <Overlay
        svg={overlay}
        style={styles.overlay}
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
  onFocus: PropTypes.func,
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
    fulfilled: '#36b0c2',
    idle: '#F3F7FE',
    pending: '#F3F7FE',
    rejected: '#fa603d',
  },
  onFocus: () => {},
  isCurrent: false,
  label: '',
  picture: null,
  overlay: '',
  uploadStatus: 'idle',
};
