import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_MIRROR_RIGHT_WIDTH = 41;
export const FRONT_LEFT_MIRROR_RIGHT_HEIGHT = 21;
export const FRONT_LEFT_MIRROR_RIGHT_TOP = 51;
export const FRONT_LEFT_MIRROR_RIGHT_LEFT = 235;

export default function FrontLeftMirrorLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_MIRROR_RIGHT_TOP + offsetTop,
          left: FRONT_LEFT_MIRROR_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_MIRROR_RIGHT_WIDTH}
        height={FRONT_LEFT_MIRROR_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 41 21"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M4.054 19.44C1.31 17.796.74 16.855.827 15.139l6.454-2.151V8.685C11.139 2.77 13.518 1.115 18.037.08c8.929.188 13.713 1.151 21.511 5.378 1.722 2.297 2.048 3.961-2.15 9.68-4.46 6.308-16.026 4.944-33.344 4.303Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftMirrorLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftMirrorLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
