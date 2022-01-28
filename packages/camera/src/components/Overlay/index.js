import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

export default function Overlay({ label, svg, ...passThoughProps }) {
  const base64 = useMemo(() => btoa(unescape(encodeURIComponent(svg))), [svg]);

  return (
    <Image
      accessibilityLabel={`Overlay ${label}`}
      source={{ uri: `data:image/svg+xml;base64,${base64}` }}
      width="100%"
      height="100%"
      {...passThoughProps}
    />
  );
}

Overlay.propTypes = {
  label: PropTypes.string,
  svg: PropTypes.string.isRequired,
};

Overlay.defaultProps = {
  label: '',
};
