import React from 'react';
import PropTypes from 'prop-types';
import { SvgXml } from 'react-native-svg';

export default function Overlay({ label, svg, ...passThoughProps }) {
  return (
    <SvgXml
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
