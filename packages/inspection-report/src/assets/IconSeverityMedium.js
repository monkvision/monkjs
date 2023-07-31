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
      <Circle cx={10.5} cy={10} r={8.5} stroke="#E1A25B" strokeWidth={3} />
      <Mask id="smmask" fill="#fff">
        <Path
          fillRule="evenodd"
          d="M10.5 20V0C4.977 0 .5 4.477.5 10s4.477 10 10 10Z"
          clipRule="evenodd"
        />
      </Mask>
      <Path
        fill="#E1A25B"
        fillRule="evenodd"
        d="M10.5 20V0C4.977 0 .5 4.477.5 10s4.477 10 10 10Z"
        clipRule="evenodd"
      />
      <Path
        fill="#E1A25B"
        d="M10.5 20v4h4v-4h-4Zm0-20h4v-4h-4v4Zm4 20V0h-8v20h8Zm-10-10a6 6 0 0 1 6-6v-8c-7.732 0-14 6.268-14 14h8Zm6 6a6 6 0 0 1-6-6h-8c0 7.732 6.268 14 14 14v-8Z"
        mask="url(#smmask)"
      />
    </Svg>
  );
}
