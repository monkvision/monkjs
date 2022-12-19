import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const FRONT_LEFT_WINDSHIELD_FRONT_WIDTH = 156;
export const FRONT_LEFT_WINDSHIELD_FRONT_HEIGHT = 67;
export const FRONT_LEFT_WINDSHIELD_FRONT_TOP = 9;
export const FRONT_LEFT_WINDSHIELD_FRONT_LEFT = 103;

export default function FrontLeftWindshieldFront({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_WINDSHIELD_FRONT_TOP + offsetTop,
          left: FRONT_LEFT_WINDSHIELD_FRONT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_WINDSHIELD_FRONT_WIDTH}
        height={FRONT_LEFT_WINDSHIELD_FRONT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 156 67"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="m148.963 4.435 6.454 3.227c-13.465 18.398-19.479 32.131-29.041 59.157l-19.36-7.53C74.391 60.985 55.208 61.182.533 44.231 20.992 26.418 34.15 16.352 57.539 3.36 90.017-1.186 111.06.63 148.963 4.435Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftWindshieldFront.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftWindshieldFront.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
