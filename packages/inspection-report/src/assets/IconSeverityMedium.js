import * as React from 'react';
import Svg, { Circle, Mask, Path } from 'react-native-svg';

export default function IconSeverityMedium(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Circle cx={10} cy={10} r={8.5} stroke="#E1A25B" strokeWidth={3} />
      <Path d="M10 0 A10 10 0 0 0 10 20 Z" fill="#E1A25B" />
    </Svg>
  );
}
