import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_WHEEL_BACK_LEFT_WIDTH = 74;
export const REAR_LEFT_WHEEL_BACK_LEFT_HEIGHT = 95;
export const REAR_LEFT_WHEEL_BACK_LEFT_TOP = 132;
export const REAR_LEFT_WHEEL_BACK_LEFT_LEFT = 102;

export default function RearLeftWheelBackLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_WHEEL_BACK_LEFT_TOP + offsetTop,
          left: REAR_LEFT_WHEEL_BACK_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_WHEEL_BACK_LEFT_WIDTH}
        height={REAR_LEFT_WHEEL_BACK_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 74 95"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M8.44711 6.66327L24.2809 0.905518C49.0844 19.6093 59.2125 36.8535 73.9415 73.5971C67.5856 83.6537 63.467 86.554 55.9486 90.8704C47.3996 97.1168 39.9519 94.9158 24.2809 85.8323C11.7655 71.1985 5.14738 62.3803 0.530212 35.452C0.339706 17.7221 2.83981 12.9293 8.44711 6.66327Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftWheelBackLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftWheelBackLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
