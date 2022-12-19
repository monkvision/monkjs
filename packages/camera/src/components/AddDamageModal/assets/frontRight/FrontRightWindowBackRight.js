import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_WINDOW_BACK_RIGHT_WIDTH = 30;
export const FRONT_RIGHT_WINDOW_BACK_RIGHT_HEIGHT = 46;
export const FRONT_RIGHT_WINDOW_BACK_RIGHT_TOP = 8;
export const FRONT_RIGHT_WINDOW_BACK_RIGHT_LEFT = 15;

export default function FrontRightWindowBackRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_WINDOW_BACK_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_WINDOW_BACK_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_WINDOW_BACK_RIGHT_WIDTH}
        height={FRONT_RIGHT_WINDOW_BACK_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 46"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M10.0128 4.35912C17.6459 0.818349 21.8769 0.363784 29.3733 1.13237C25.1607 16.0851 24.1331 25.8745 23.9954 45.2313L0.33252 31.2487L10.0128 4.35912Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightWindowBackRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightWindowBackRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
