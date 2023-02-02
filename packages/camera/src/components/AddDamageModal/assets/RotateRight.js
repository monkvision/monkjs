import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export default function RotateRight({ width, height }) {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 37"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="box-none"
    >
      <Path
        d="M9.64 6.117c2.684 3.083 4.334 7.083 4.334 11.5 0 7.75-5.05 14.3-12.034 16.6l-1.3-3.934c5.317-1.75 9.167-6.75 9.167-12.666 0-3.25-1.2-6.217-3.133-8.534L.64 15.117v-15h15l-6 6Z"
        fill="#fff"
      />
    </Svg>
  );
}

RotateRight.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

RotateRight.defaultProps = {
  height: 37,
  width: 16,
};
