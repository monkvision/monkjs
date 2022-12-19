import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_FOG_LIGHT_FRONT_RIGHT_WIDTH = 14;
export const FRONT_RIGHT_FOG_LIGHT_FRONT_RIGHT_HEIGHT = 30;
export const FRONT_RIGHT_FOG_LIGHT_FRONT_RIGHT_TOP = 166;
export const FRONT_RIGHT_FOG_LIGHT_FRONT_RIGHT_LEFT = 179;

export default function FrontRightFogLightFrontRight({
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
          top: FRONT_RIGHT_FOG_LIGHT_FRONT_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_FOG_LIGHT_FRONT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_FOG_LIGHT_FRONT_RIGHT_WIDTH}
        height={FRONT_RIGHT_FOG_LIGHT_FRONT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 30"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M10.2585 29.2079C13.4852 28.1323 15.9855 7.53522 10.2585 2.31833C7.23669 0.429962 5.02725 0.660717 0.578247 2.31833C0.858131 13.9908 7.03175 30.2836 10.2585 29.2079Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightFogLightFrontRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightFogLightFrontRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
