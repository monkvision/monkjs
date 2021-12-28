import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

import { useTheme } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';

import InnerCircle from './InnerCircle';

/**
 * @param animated {bool}
 * @param color {string}
 * @param passThroughProps {object}
 * @returns {JSX.Element}
 * @constructor
 */
function Loader({
  animated,
  color,
  ...passThroughProps
}) {
  const { colors } = useTheme();

  return (
    <Svg
      viewBox="0 0 100 100"
      width={100}
      height={100}
      {...passThroughProps}
    >
      <G>
        <Circle
          stroke={isEmpty(color) ? colors.primary : color}
          fill="transparent"
          strokeWidth={12}
          cx="50"
          cy="50"
          r="38"
        />
        <InnerCircle animated={animated} />
      </G>
    </Svg>
  );
}

Loader.propTypes = {
  animated: PropTypes.bool,
  color: PropTypes.string,
};

Loader.defaultProps = {
  animated: true,
  color: '',
};

export default Loader;
