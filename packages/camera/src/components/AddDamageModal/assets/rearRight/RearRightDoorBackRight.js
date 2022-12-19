import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_DOOR_BACK_RIGHT_WIDTH = 71;
export const REAR_RIGHT_DOOR_BACK_RIGHT_HEIGHT = 90;
export const REAR_RIGHT_DOOR_BACK_RIGHT_TOP = 66;
export const REAR_RIGHT_DOOR_BACK_RIGHT_LEFT = 197;

export default function RearRightDoorBackRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_DOOR_BACK_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_DOOR_BACK_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_DOOR_BACK_RIGHT_WIDTH}
        height={REAR_RIGHT_DOOR_BACK_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 71 90"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M63.2134 66.9058C72.1323 28.978 74.064 12.1556 64.6529 0.69165C38.2767 3.57089 24.0325 4.3628 0.5979 2.85081C9.16244 28.2394 11.2289 41.671 11.3937 61.148C25.0381 63.6881 26.1783 71.9364 25.0683 89.9368L63.2134 66.9058Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightDoorBackRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightDoorBackRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
