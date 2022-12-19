import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_WHEEL_FRONT_RIGHT_WIDTH = 67;
export const FRONT_RIGHT_WHEEL_FRONT_RIGHT_HEIGHT = 93;
export const FRONT_RIGHT_WHEEL_FRONT_RIGHT_TOP = 123;
export const FRONT_RIGHT_WHEEL_FRONT_RIGHT_LEFT = 100;

export default function FrontRightWheelFrontRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_WHEEL_FRONT_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_WHEEL_FRONT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_WHEEL_FRONT_RIGHT_WIDTH}
        height={FRONT_RIGHT_WHEEL_FRONT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 67 93"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M66.9143 80.8128C57.9388 40.3503 47.6358 22.8474 20.6642 0.144043C1.76047 8.21163 -4.34606 16.6181 3.45477 48.5453C22.4499 84.4185 31.1393 93.2708 47.5536 92.6442L66.9143 80.8128Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightWheelFrontRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightWheelFrontRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
