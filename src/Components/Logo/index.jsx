import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';
import isEmpty from 'Functions/isEmpty';

/**
 * Display Monk's SVG logo
 * @param color {string}
 * @param height {number}
 * @param theme
 * @param width {number}
 * @returns {JSX.Element}
 * @constructor
 */
function Logo({ color, height, width }) {
  const { colors } = useTheme();

  const stroke = useMemo(
    () => (isEmpty(color) ? colors.primary : color),
    [color, colors.primary],
  );

  return (
    <Svg
      viewBox="0 0 100 100"
      style={{ height, width }}
    >
      <G id="logo">
        <Circle
          stroke={stroke}
          fill="transparent"
          strokeWidth={12}
          cx="50"
          cy="50"
          r="38"
        />
        <Circle fill="#000" cx="50" cy="50" r="11" />
      </G>
    </Svg>
  );
}

Logo.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};

Logo.defaultProps = {
  color: '',
  height: 75,
  width: 75,
};

export default Logo;
