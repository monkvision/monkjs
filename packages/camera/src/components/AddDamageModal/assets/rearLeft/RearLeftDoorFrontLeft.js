import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_DOOR_FRONT_LEFT_WIDTH = 46;
export const REAR_LEFT_DOOR_FRONT_LEFT_HEIGHT = 69;
export const REAR_LEFT_DOOR_FRONT_LEFT_TOP = 63;
export const REAR_LEFT_DOOR_FRONT_LEFT_LEFT = 15;

export default function RearLeftDoorFrontLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_DOOR_FRONT_LEFT_TOP + offsetTop,
          left: REAR_LEFT_DOOR_FRONT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_DOOR_FRONT_LEFT_WIDTH}
        height={REAR_LEFT_DOOR_FRONT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 46 69"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M45.0673 68.4661C36.7346 31.1258 34.3744 13.8499 43.6278 4.41109L9.80104 0.0927734C8.61894 1.12201 6.75945 1.28426 3.32357 1.53221C-1.72365 8.8659 1.29608 20.6938 12.6799 49.7534L45.0673 68.4661Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftDoorFrontLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftDoorFrontLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
