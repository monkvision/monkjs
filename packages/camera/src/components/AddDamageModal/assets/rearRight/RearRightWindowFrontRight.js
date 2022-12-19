import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_WINDOW_FRONT_RIGHT_WIDTH = 49;
export const REAR_RIGHT_WINDOW_FRONT_RIGHT_HEIGHT = 50;
export const REAR_RIGHT_WINDOW_FRONT_RIGHT_TOP = 17;
export const REAR_RIGHT_WINDOW_FRONT_RIGHT_LEFT = 248;

export default function RearRightWindowFrontRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_WINDOW_FRONT_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_WINDOW_FRONT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_WINDOW_FRONT_RIGHT_WIDTH}
        height={REAR_RIGHT_WINDOW_FRONT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 49 50"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M48.1992 35.2972C33.5548 11.0856 23.3095 2.99124 0.697754 0.0310059L13.6527 49.6916L46.04 46.093V41.055H46.7598L48.1992 35.2972Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightWindowFrontRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightWindowFrontRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
