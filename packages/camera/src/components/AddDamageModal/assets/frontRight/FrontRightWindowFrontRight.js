import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_WINDOW_FRONT_RIGHT_WIDTH = 50;
export const FRONT_RIGHT_WINDOW_FRONT_RIGHT_HEIGHT = 67;
export const FRONT_RIGHT_WINDOW_FRONT_RIGHT_TOP = 9;
export const FRONT_RIGHT_WINDOW_FRONT_RIGHT_LEFT = 40;

export default function FrontRightWindowFrontRight({
  offsetTop,
  offsetLeft,
  onPress,
  isDisplayed,
}) {
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
          top: FRONT_RIGHT_WINDOW_FRONT_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_WINDOW_FRONT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_WINDOW_FRONT_RIGHT_WIDTH}
        height={FRONT_RIGHT_WINDOW_FRONT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 67"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M26.1091 14.1147C19.9853 4.81151 15.6808 1.37287 5.60251 0.13208C1.38529 14.1589 -0.459433 24.5722 0.205796 43.1554L5.60296 46.3822C13.582 43.3737 18.0686 40.9285 26.109 41.0042C35.8224 45.3066 38.5993 47.8016 39.0603 54.9868L44.4568 57.138C44.9821 60.5874 42.9819 60.935 39.0606 62.5159L49.8535 66.8182C46.8554 53.7865 40.8207 40.4975 26.1091 14.1147Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightWindowFrontRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightWindowFrontRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
