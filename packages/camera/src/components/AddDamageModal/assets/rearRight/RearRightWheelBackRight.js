import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_WHEEL_BACK_RIGHT_WIDTH = 74;
export const REAR_RIGHT_WHEEL_BACK_RIGHT_HEIGHT = 95;
export const REAR_RIGHT_WHEEL_BACK_RIGHT_TOP = 132;
export const REAR_RIGHT_WHEEL_BACK_RIGHT_LEFT = 145;

export default function RearRightWheelBackRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_WHEEL_BACK_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_WHEEL_BACK_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_WHEEL_BACK_RIGHT_WIDTH}
        height={REAR_RIGHT_WHEEL_BACK_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 74 95"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M65.553 6.66327L49.7192 0.905518C24.9157 19.6093 14.7876 36.8535 0.0585938 73.5971C6.41454 83.6537 10.5331 86.554 18.0516 90.8704C26.6006 97.1168 34.0483 94.9158 49.7192 85.8323C62.2346 71.1985 68.8527 62.3803 73.4699 35.452C73.6604 17.7221 71.1603 12.9293 65.553 6.66327Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightWheelBackRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightWheelBackRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
