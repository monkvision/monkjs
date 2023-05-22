import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

export default function IconSeverityNone(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Circle cx={10} cy={10} r={10} fill="#fff" />
    </Svg>
  );
}
