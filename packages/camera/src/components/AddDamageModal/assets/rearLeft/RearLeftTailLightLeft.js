import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_TAIL_LIGHT_LEFT_WIDTH = 114;
export const REAR_LEFT_TAIL_LIGHT_LEFT_HEIGHT = 36;
export const REAR_LEFT_TAIL_LIGHT_LEFT_TOP = 95;
export const REAR_LEFT_TAIL_LIGHT_LEFT_LEFT = 170;

export default function RearLeftTailLightLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_TAIL_LIGHT_LEFT_TOP + offsetTop,
          left: REAR_LEFT_TAIL_LIGHT_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_TAIL_LIGHT_LEFT_WIDTH}
        height={REAR_LEFT_TAIL_LIGHT_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 114 36"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M111.02 0.480225L72.1552 4.07882L37.6087 3.3591L3.06223 1.91966C-1.98958 3.02238 0.835449 7.24432 5.76433 14.6104L5.9411 14.8746C13.2548 25.2343 17.8071 28.1063 26.0932 32.1479C38.444 36.7237 45.7506 36.8209 59.2003 34.307L77.913 31.4281C87.2792 29.3097 92.5525 27.9743 102.383 22.7915L113.179 6.95769C114.558 2.65821 113.97 1.34713 111.02 0.480225Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftTailLightLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftTailLightLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
