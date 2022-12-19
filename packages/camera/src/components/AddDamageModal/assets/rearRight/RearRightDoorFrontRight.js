import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_DOOR_FRONT_RIGHT_WIDTH = 46;
export const REAR_RIGHT_DOOR_FRONT_RIGHT_HEIGHT = 69;
export const REAR_RIGHT_DOOR_FRONT_RIGHT_TOP = 63;
export const REAR_RIGHT_DOOR_FRONT_RIGHT_LEFT = 260;

export default function RearRightDoorFrontRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_DOOR_FRONT_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_DOOR_FRONT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_DOOR_FRONT_RIGHT_WIDTH}
        height={REAR_RIGHT_DOOR_FRONT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 46 69"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M0.932739 68.4661C9.26543 31.1258 11.6256 13.8499 2.37218 4.41109L36.199 0.0927734C37.3811 1.12201 39.2406 1.28426 42.6764 1.53221C47.7237 8.8659 44.7039 20.6938 33.3201 49.7534L0.932739 68.4661Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightDoorFrontRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightDoorFrontRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
