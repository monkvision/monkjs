import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function IconChevronLeft(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={8}
      height={12}
      fill="none"
      {...props}
    >
      <Path fill="#fff" d="m6 12 1.41-1.41L2.83 6l4.58-4.59L6 0 0 6l6 6Z" />
    </Svg>
  );
}
