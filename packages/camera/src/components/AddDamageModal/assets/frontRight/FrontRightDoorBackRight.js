import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_DOOR_BACK_RIGHT_WIDTH = 39;
export const FRONT_RIGHT_DOOR_BACK_RIGHT_HEIGHT = 84;
export const FRONT_RIGHT_DOOR_BACK_RIGHT_TOP = 39;
export const FRONT_RIGHT_DOOR_BACK_RIGHT_LEFT = 8;

export default function FrontRightDoorBackRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_DOOR_BACK_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_DOOR_BACK_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_DOOR_BACK_RIGHT_WIDTH}
        height={FRONT_RIGHT_DOOR_BACK_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 39 84"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M7.33417 0.248291L30.997 14.2309C22.9632 21.4613 30.9753 47.9296 38.5261 83.0682C30.2083 77.0713 25.6179 73.6798 19.1656 66.9345C11.2882 47.6684 7.0806 38.3275 0.880668 30.3646C-0.763814 18.0819 -0.071574 11.3938 7.33417 0.248291Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightDoorBackRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightDoorBackRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
