import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import PropTypes from 'prop-types';

const xml = (color) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="509" height="376" fill="none">
    <path stroke="${color}" stroke-linecap="round" stroke-width="3.27149" d="m340.118 146.945-31.079 4.362 70.337 45.256 49.133 7.728"/>
    <path stroke="${color}" stroke-width="3.27149" d="m100.209 125.68-168.4815-11.995M-69.3638 15.5406c47.6184.727 173.9348 26.39 298.2508 123.2264l-81.787-7.088"/>
    <path stroke="${color}" stroke-width="3.27149" d="m145.465 133.86-44.166-5.998c-6.5426-18.757-.545-33.6238 3.272-38.7128h14.176c22.247 6.1068 27.081 32.3518 26.718 44.7108Z"/>
    <path stroke="${color}" stroke-width="3.27149" d="M-71 3c48.8907 2.181 181.895 28.571 322.787 116.683l162.485 50.163c13.449 21.447 35.005 80.043 13.631 142.855l-75.79 13.632c6.18-40.167-1.308-119.955-80.697-117.774-25.99.727-80.478 22.573-90.511 104.142H-66.638"/>
    <circle cx="269.782" cy="297.979" r="73.0634" stroke="${color}" stroke-width="3.27149"/>
    <rect width="56.8483" height="9.16044" x="-57.1996" y="152.682" stroke="${color}" stroke-width="3.27149" rx="4.58022" transform="rotate(2.087 -57.1996 152.682)"/>
  </svg>
`;

export default function AbstractFrontLateralRight({ color, ...props }) { return (<SvgXml xml={xml(color)} height="100%" {...props} />); }

AbstractFrontLateralRight.propTypes = {
  color: PropTypes.string,
};
AbstractFrontLateralRight.defaultProps = {
  color: '#fff',
};
