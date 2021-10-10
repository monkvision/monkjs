import React from 'react';
import PropTypes from 'prop-types';
import { SvgXml } from 'react-native-svg';

export default function Mask({ alt, xml, ...props }) {
  return <SvgXml alt={alt} xml={xml} {...props} />;
}

Mask.propTypes = {
  alt: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
};
