import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';
import log from '../../utils/log';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Overlay({ label, svg, transform, ...passThoughProps }) {
  const base64 = useMemo(() => btoa(unescape(encodeURIComponent(svg))), [svg]);

  useEffect(() => {
    log(['[Event] Loading sight', label]);
  }, [label]);

  return (
    <View style={[styles.container, transform ? { transform } : undefined]}>
      <Image
        accessibilityLabel={`Overlay wow ${label}`}
        source={{ uri: `data:image/svg+xml;base64,${base64}` }}
        width="100%"
        height="100%"
        {...passThoughProps}
      />
    </View>
  );
}

Overlay.propTypes = {
  label: PropTypes.string,
  svg: PropTypes.string.isRequired,
  transform: PropTypes.object,
};

Overlay.defaultProps = {
  label: '',
  transform: undefined,
};
