import React from 'react';
import PropTypes from 'prop-types';
import { SvgCss } from 'react-native-svg';

export default function Overlay({ label, svg, ...passThoughProps }) {
  let newSVG = svg;
  if (!svg.includes('viewBox')) {
    const widthParam = 'width="';
    const widthStart = svg.indexOf(widthParam) + widthParam.length;
    const widthEnd = widthStart + svg.substring(widthStart).indexOf('"');
    const width = svg.substring(widthStart, widthEnd);

    const heighParam = 'height="';
    const heightStart = svg.indexOf(heighParam) + heighParam.length;
    const heightEnd = heightStart + svg.substring(heightStart).indexOf('"');
    const height = svg.substring(heightStart, heightEnd);

    newSVG = svg.replace(svg.substring(svg.indexOf(widthParam), heightEnd + 1), `x="0" y="0" viewBox="0 0 ${width} ${height}"`);
  }
  return (
    <SvgCss
      xml={newSVG}
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
