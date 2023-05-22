import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function IconChevronRight(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={8}
      height={12}
      fill="none"
      {...props}
    >
      <Path fill="#fff" d="M2 0 .59 1.41 5.17 6 .59 10.59 2 12l6-6-6-6Z" />
    </Svg>
  );
}
