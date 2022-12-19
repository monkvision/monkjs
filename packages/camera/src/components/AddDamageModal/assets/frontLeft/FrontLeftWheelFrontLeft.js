import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_WHEEL_FRONT_LEFT_WIDTH = 67;
export const FRONT_LEFT_WHEEL_FRONT_LEFT_HEIGHT = 93;
export const FRONT_LEFT_WHEEL_FRONT_LEFT_TOP = 123;
export const FRONT_LEFT_WHEEL_FRONT_LEFT_LEFT = 154;

export default function FrontLeftWheelFrontLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_WHEEL_FRONT_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_WHEEL_FRONT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_WHEEL_FRONT_LEFT_WIDTH}
        height={FRONT_LEFT_WHEEL_FRONT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 67 93"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M.086 80.813C9.06 40.35 19.364 22.847 46.336.144c18.904 8.068 25.01 16.474 17.21 48.401-18.996 35.873-27.685 44.726-44.1 44.1L.086 80.812Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftWheelFrontLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftWheelFrontLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
