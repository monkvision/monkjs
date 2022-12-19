import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_DOOR_FRONT_RIGHT_WIDTH = 56;
export const FRONT_RIGHT_DOOR_FRONT_RIGHT_HEIGHT = 102;
export const FRONT_RIGHT_DOOR_FRONT_RIGHT_TOP = 52;
export const FRONT_RIGHT_DOOR_FRONT_RIGHT_LEFT = 35;

export default function FrontRightDoorFrontRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_DOOR_FRONT_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_DOOR_FRONT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_DOOR_FRONT_RIGHT_WIDTH}
        height={FRONT_RIGHT_DOOR_FRONT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 56 102"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M41.6429 18.4404L54.5499 24.8939C49.9669 48.1122 51.2277 66.1862 55.6255 101.26L11.5265 68.9928C1.93805 30.8649 -2.40823 11.228 3.99746 0.155518L10.451 3.38227C7.56391 8.25742 8.57185 10.8294 13.6777 15.2137C16.3107 19.6243 23.9795 19.7432 41.6429 18.4404Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightDoorFrontRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightDoorFrontRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
