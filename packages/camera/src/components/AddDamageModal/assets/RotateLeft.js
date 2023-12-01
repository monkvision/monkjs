import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

export default function RotateLeft({ width, height }) {
  return (
    <Svg
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 21"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents={Platform.OS === 'web' ? 'box-none' : undefined}
    >
      <Path
        d="M3.87 3.87c-1.61 1.85-2.6 4.25-2.6 6.9 0 4.65 3.03 8.58 7.22 9.96l.78-2.36a8.002 8.002 0 0 1-5.5-7.6c0-1.95.72-3.73 1.88-5.12l3.62 3.62v-9h-9l3.6 3.6Z"
        fill="#fff"
      />
    </Svg>
  );
}

RotateLeft.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

RotateLeft.defaultProps = {
  height: 37,
  width: 16,
};
