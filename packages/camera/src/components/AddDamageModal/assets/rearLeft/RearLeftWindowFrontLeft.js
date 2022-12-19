import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_WINDOW_FRONT_LEFT_WIDTH = 49;
export const REAR_LEFT_WINDOW_FRONT_LEFT_HEIGHT = 50;
export const REAR_LEFT_WINDOW_FRONT_LEFT_TOP = 17;
export const REAR_LEFT_WINDOW_FRONT_LEFT_LEFT = 24;

export default function RearLeftWindowFrontLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_WINDOW_FRONT_LEFT_TOP + offsetTop,
          left: REAR_LEFT_WINDOW_FRONT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_WINDOW_FRONT_LEFT_WIDTH}
        height={REAR_LEFT_WINDOW_FRONT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 49 50"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M0.800819 35.2972C15.4452 11.0856 25.6905 2.99124 48.3023 0.0310059L35.3473 49.6916L2.95998 46.093V41.055H2.24026L0.800819 35.2972Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftWindowFrontLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftWindowFrontLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
