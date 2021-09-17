import React from 'react';
import PropTypes from 'prop-types';
import Svg, { G, Circle } from 'react-native-svg';

export default function LogoIcon({ innerColor, outerColor, ...passThroughProps }) {
  return (
    <Svg
      width={1024}
      height={1024}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      {...passThroughProps}
    >
      <G>
        <Circle
          stroke={outerColor}
          strokeWidth="124"
          fill="transparent"
          cx="512"
          cy="512"
          r="390"
        />
        <Circle
          fill={innerColor}
          cx="512"
          cy="512"
          r="102"
        />
      </G>
    </Svg>
  );
}

LogoIcon.propTypes = {
  innerColor: PropTypes.string,
  outerColor: PropTypes.string,
};

LogoIcon.defaultProps = {
  innerColor: '#000',
  outerColor: '#274b9f',
};
