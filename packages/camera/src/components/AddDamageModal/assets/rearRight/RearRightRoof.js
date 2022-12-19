import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_ROOF_WIDTH = 183;
export const REAR_RIGHT_ROOF_HEIGHT = 25;
export const REAR_RIGHT_ROOF_TOP = 5;
export const REAR_RIGHT_ROOF_LEFT = 99;

export default function RearRightRoof({ offsetTop, offsetLeft, onPress, isDisplayed }) {
  const opacity = useMemo(() => (isDisplayed ? 1 : 0), [isDisplayed]);
  const handlePress = useMemo(
    () => (typeof onPress === 'function' ? onPress : () => {}),
    [onPress],
  );

  return (
    <View
      style={[
        {
          position: 'absolute',
          top: REAR_RIGHT_ROOF_TOP + offsetTop,
          left: REAR_RIGHT_ROOF_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_ROOF_WIDTH}
        height={REAR_RIGHT_ROOF_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 183 25"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M50.3764 18.5081C46.8074 10.8461 30.58 9.14309 0.71582 6.27292C30.4182 3.83989 46.8103 3.15188 75.5666 3.39404C103.542 0.710674 119.059 -1.051 152.576 4.83348C163.883 8.10209 170.571 13.1011 182.805 24.9856C168.042 14.6409 158.093 11.4125 136.743 10.5912C112.707 11.3477 104.242 13.6196 91.4004 18.5081H50.3764Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightRoof.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightRoof.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
