import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_DOOR_BACK_LEFT_WIDTH = 39;
export const FRONT_LEFT_DOOR_BACK_LEFT_HEIGHT = 84;
export const FRONT_LEFT_DOOR_BACK_LEFT_TOP = 39;
export const FRONT_LEFT_DOOR_BACK_LEFT_LEFT = 273;

export default function FrontLeftDoorBackLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_DOOR_BACK_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_DOOR_BACK_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_DOOR_BACK_LEFT_WIDTH}
        height={FRONT_LEFT_DOOR_BACK_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 39 84"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M31.666.248 8.003 14.231c8.034 7.23.022 33.699-7.53 68.837 8.319-5.997 12.909-9.388 19.361-16.133 7.878-19.267 12.085-28.608 18.285-36.57 1.645-12.283.953-18.971-6.453-30.117Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftDoorBackLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftDoorBackLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
