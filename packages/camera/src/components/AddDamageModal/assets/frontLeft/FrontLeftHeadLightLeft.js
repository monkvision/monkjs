import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_HEAD_LIGHT_LEFT_WIDTH = 113;
export const FRONT_LEFT_HEAD_LIGHT_LEFT_HEIGHT = 45;
export const FRONT_LEFT_HEAD_LIGHT_LEFT_TOP = 100;
export const FRONT_LEFT_HEAD_LIGHT_LEFT_LEFT = 59;

export default function FrontLeftHeadLightLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_HEAD_LIGHT_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_HEAD_LIGHT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_HEAD_LIGHT_LEFT_WIDTH}
        height={FRONT_LEFT_HEAD_LIGHT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 113 45"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M21.945 23.144C49.134 10.707 70.71 3.84 112.294.557c.875 6.854-5.365 15.279-19.36 32.267-23.91 8.904-41.193 12.104-84.972 11.832-4.65-1.383-7.31-2.308-7.529-4.303 1.43-5.522 8.298-9.519 21.18-17.016l.332-.193Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftHeadLightLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftHeadLightLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
