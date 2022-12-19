import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_DOOR_FRONT_LEFT_WIDTH = 56;
export const FRONT_LEFT_DOOR_FRONT_LEFT_HEIGHT = 102;
export const FRONT_LEFT_DOOR_FRONT_LEFT_TOP = 52;
export const FRONT_LEFT_DOOR_FRONT_LEFT_LEFT = 229;

export default function FrontLeftDoorFrontLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_DOOR_FRONT_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_DOOR_FRONT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_DOOR_FRONT_LEFT_WIDTH}
        height={FRONT_LEFT_DOOR_FRONT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 56 102"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M14.357 18.44 1.45 24.894C6.033 48.112 4.772 66.186.374 101.26l44.1-32.267C54.061 30.865 58.407 11.228 52.002.156l-6.454 3.226c2.887 4.875 1.88 7.447-3.227 11.832-2.633 4.41-10.302 4.53-27.965 3.226Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftDoorFrontLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftDoorFrontLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
