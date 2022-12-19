import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_TAIL_LIGHT_RIGHT_WIDTH = 114;
export const REAR_RIGHT_TAIL_LIGHT_RIGHT_HEIGHT = 36;
export const REAR_RIGHT_TAIL_LIGHT_RIGHT_TOP = 95;
export const REAR_RIGHT_TAIL_LIGHT_RIGHT_LEFT = 37;

export default function RearRightTailLightRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_TAIL_LIGHT_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_TAIL_LIGHT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_TAIL_LIGHT_RIGHT_WIDTH}
        height={REAR_RIGHT_TAIL_LIGHT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 114 36"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M2.97989 0.480225L41.8447 4.07882L76.3912 3.3591L110.938 1.91966C115.99 3.02238 113.164 7.24432 108.236 14.6104L108.059 14.8746C100.745 25.2343 96.1929 28.1063 87.9067 32.1479C75.556 36.7237 68.2494 36.8209 54.7996 34.307L36.087 31.4281C26.7207 29.3097 21.4474 27.9743 11.6165 22.7915L0.82073 6.95769C-0.558246 2.65821 0.0296225 1.34713 2.97989 0.480225Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightTailLightRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightTailLightRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
