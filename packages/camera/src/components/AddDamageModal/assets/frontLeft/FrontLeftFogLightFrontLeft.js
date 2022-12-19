import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_FOG_LIGHT_FRONT_LEFT_WIDTH = 14;
export const FRONT_LEFT_FOG_LIGHT_FRONT_LEFT_HEIGHT = 30;
export const FRONT_LEFT_FOG_LIGHT_FRONT_LEFT_TOP = 166;
export const FRONT_LEFT_FOG_LIGHT_FRONT_LEFT_LEFT = 117;

export default function FrontLeftFogLightFrontLeft({
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
          top: FRONT_LEFT_FOG_LIGHT_FRONT_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_FOG_LIGHT_FRONT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_FOG_LIGHT_FRONT_LEFT_WIDTH}
        height={FRONT_LEFT_FOG_LIGHT_FRONT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 30"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M3.741 29.208c-3.226-1.076-5.727-21.673 0-26.89 3.022-1.888 5.232-1.657 9.68 0-.28 11.673-6.453 27.966-9.68 26.89Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftFogLightFrontLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftFogLightFrontLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
