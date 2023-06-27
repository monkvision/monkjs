import '@expo/match-media';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View, Platform } from 'react-native';

import { SIDE_WIDTH } from '../Layout';
import Overlay from '../Overlay';

const MARGIN = 8;
const BORDER_WIDTH = 2;
const LENGTH = SIDE_WIDTH - (MARGIN * 2) - BORDER_WIDTH;

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    justifyContent: 'center',
    width: LENGTH,
    height: LENGTH,
    margin: MARGIN,
    borderRadius: 5,
    borderWidth: BORDER_WIDTH,
    overflow: 'hidden',
  },
  overlay: {
    height: LENGTH * 0.75,
    width: '100%',
    flex: 1,
  },
  loader: {
    flexGrow: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    color: 'white',
    lineHeight: 10,
    fontSize: 10,
    ...Platform.select({
      web: {
        fontFamily: 'monospace',
      },
    }),
    textAlign: 'center',
    maxWidth: '100%',
    paddingVertical: 2,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
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
    <View>
      <View
        style={[
          styles.root,
          { borderColor, backgroundColor: colors.background },
          style,
        ]}
        {...passThroughProps}
      >
        <ImageBackground
          source={picture}
          resizeMode="cover"
          style={[styles.image, {
            justifyContent: picture && uploadStatus !== 'pending' ? 'flex-end' : 'space-between',
          }]}
        >
          {uploadStatus === 'pending' && (
          <ActivityIndicator style={styles.loader} color={colors[uploadStatus]} />
          )}
          {(!picture && uploadStatus !== 'pending' && !!overlay) && (
            <Overlay
              svg={overlay}
              label={label}
              rootStyles={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%' }}
            />
          )}
          <Text style={styles.text}>{label}</Text>
        </ImageBackground>
      </View>
    </View>
  );
}

Thumbnail.propTypes = {
  colors: PropTypes.shape({
    background: PropTypes.string,
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
    background: '#181829',
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
