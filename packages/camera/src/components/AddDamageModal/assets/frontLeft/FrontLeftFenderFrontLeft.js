import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_FENDER_FRONT_LEFT_WIDTH = 85;
export const FRONT_LEFT_FENDER_FRONT_LEFT_HEIGHT = 89;
export const FRONT_LEFT_FENDER_FRONT_LEFT_TOP = 69;
export const FRONT_LEFT_FENDER_FRONT_LEFT_LEFT = 149;

export default function FrontLeftFenderFrontLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_FENDER_FRONT_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_FENDER_FRONT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_FENDER_FRONT_LEFT_WIDTH}
        height={FRONT_LEFT_FENDER_FRONT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 85 89"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M.784 64.9c17.475-18.525 23.03-26.347 21.511-33.343 16.828-6.367 27.06-9.457 39.797-18.285 2.49-4.938 2.872-7.786 2.151-12.907l17.21 7.529c4.686 24.438 3.73 42.221-1.076 77.442l-7.53 3.227c4.455-20.22 5.077-30.08-6.453-37.646-12.896-1.817-22.912 7.02-44.099 34.419L.784 64.9Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftFenderFrontLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftFenderFrontLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
