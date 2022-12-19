import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_BUMPER_FRONT_WIDTH = 166;
export const FRONT_LEFT_BUMPER_FRONT_HEIGHT = 131;
export const FRONT_LEFT_BUMPER_FRONT_TOP = 88;
export const FRONT_LEFT_BUMPER_FRONT_LEFT = 6;

export default function FrontLeftBumperFront({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_BUMPER_FRONT_TOP + offsetTop,
          left: FRONT_LEFT_BUMPER_FRONT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_BUMPER_FRONT_WIDTH}
        height={FRONT_LEFT_BUMPER_FRONT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 166 131"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M9.778.916c3.102 10.58 15.264 18.149 61.219 35.442L55.96 48.172c-7.672 6.289 1.688 6.574 10.74 9.666 35.733-1.372 54.884-2.622 76.255-11.814L165.51 66.43c-9.382 13.905-13.285 26.314-19.332 51.553-15.21 9.04-25.049 10.752-42.961 12.888-26.958.186-42.437-3.338-71.959-27.924-11.89-11.001-16.079-16.012-16.11-21.48l16.11 16.11-2.148-11.814 10.74 4.296c8.696-1.563 13.277-2.892 17.184-11.814-6.424-7.737-11.481-12.184-23.628-20.407C20.17 52.312 11.074 46.862.112 35.284V8.434L9.778.916Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftBumperFront.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftBumperFront.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
