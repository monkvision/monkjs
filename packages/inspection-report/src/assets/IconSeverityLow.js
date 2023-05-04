import * as React from 'react';
import Svg, { Circle } from 'react-native-svg';

export default function IconSeverityLow(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Circle cx={10} cy={10} r={8.5} stroke="#64B5F6" strokeWidth={3} />
    </Svg>
  );
}
