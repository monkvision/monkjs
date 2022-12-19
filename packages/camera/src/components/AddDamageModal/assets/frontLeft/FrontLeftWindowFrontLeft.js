import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_WINDOW_FRONT_LEFT_WIDTH = 50;
export const FRONT_LEFT_WINDOW_FRONT_LEFT_HEIGHT = 67;
export const FRONT_LEFT_WINDOW_FRONT_LEFT_TOP = 9;
export const FRONT_LEFT_WINDOW_FRONT_LEFT_LEFT = 230;

export default function FrontLeftWindowFrontLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_WINDOW_FRONT_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_WINDOW_FRONT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_WINDOW_FRONT_LEFT_WIDTH}
        height={FRONT_LEFT_WINDOW_FRONT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 67"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M23.89 14.115C30.016 4.812 34.32 1.373 44.398.132c4.218 14.027 6.062 24.44 5.397 43.023l-5.397 3.227c-7.98-3.008-12.466-5.453-20.506-5.378-9.714 4.303-12.49 6.798-12.951 13.983l-5.397 2.151c-.525 3.45 1.475 3.797 5.396 5.378L.146 66.818c2.999-13.032 9.033-26.32 23.745-52.703Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftWindowFrontLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftWindowFrontLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
