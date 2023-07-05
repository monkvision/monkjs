import React from 'react';
import PropTypes from 'prop-types';
import { SvgCss } from 'react-native-svg';

export default function Overlay({ label, svg, ...passThoughProps }) {
  return (
    <SvgCss
      xml={svg}
      width="100%"
      height="100%"
      accessibilityLabel={`Overlay ${label}`}
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
