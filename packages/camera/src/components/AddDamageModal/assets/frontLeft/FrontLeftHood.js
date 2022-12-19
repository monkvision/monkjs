import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_HOOD_WIDTH = 200;
export const FRONT_LEFT_HOOD_HEIGHT = 77;
export const FRONT_LEFT_HOOD_TOP = 48;
export const FRONT_LEFT_HOOD_LEFT = 14;

export default function FrontLeftHood({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_HOOD_TOP + offsetTop,
          left: FRONT_LEFT_HOOD_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_HOOD_WIDTH}
        height={FRONT_LEFT_HOOD_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 77"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M0 39.57C23.156 20 49.63 13.332 92.328 0l-3.259 5.347c51.524 13.183 80.976 21.054 108.622 13.903 2.828 4.118 3.318 6.935 0 13.903-11.832 9.289-21.535 12.543-39.104 18.18C99.757 61.533 76.075 67.177 63 77 23.415 61.822 5.268 53.465 0 39.57Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftHood.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftHood.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
