import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_DOOR_BACK_LEFT_WIDTH = 71;
export const REAR_LEFT_DOOR_BACK_LEFT_HEIGHT = 90;
export const REAR_LEFT_DOOR_BACK_LEFT_TOP = 66;
export const REAR_LEFT_DOOR_BACK_LEFT_LEFT = 53;

export default function RearLeftDoorBackLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_DOOR_BACK_LEFT_TOP + offsetTop,
          left: REAR_LEFT_DOOR_BACK_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_DOOR_BACK_LEFT_WIDTH}
        height={REAR_LEFT_DOOR_BACK_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 71 90"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M7.78704 66.9058C-1.13177 28.978 -3.06356 12.1556 6.3476 0.69165C32.7238 3.57089 46.968 4.3628 70.4026 2.85081C61.838 28.2394 59.7716 41.671 59.6068 61.148C45.9624 63.6881 44.8222 71.9364 45.9321 89.9368L7.78704 66.9058Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftDoorBackLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftDoorBackLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
