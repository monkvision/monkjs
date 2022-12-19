import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_WINDSHIELD_BACK_WIDTH = 108;
export const REAR_LEFT_WINDSHIELD_BACK_HEIGHT = 59;
export const REAR_LEFT_WINDSHIELD_BACK_TOP = 25;
export const REAR_LEFT_WINDSHIELD_BACK_LEFT = 202;

export default function RearLeftWindshieldBack({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_WINDSHIELD_BACK_TOP + offsetTop,
          left: REAR_LEFT_WINDSHIELD_BACK_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_WINDSHIELD_BACK_WIDTH}
        height={REAR_LEFT_WINDSHIELD_BACK_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 108 59"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M107.81 38.813L76.1422 3.54678C63.086 0.417532 55.1228 0.138783 40.1562 1.38763C17.0541 3.02489 8.25538 4.39503 0.571709 7.14538C-1.28672 15.8373 13.584 32.7585 32.9591 57.5257C46.9035 59.1345 56.1206 58.7152 76.1422 54.6468L91.976 51.0482C100.93 48.4742 105.701 46.8271 107.81 38.813Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftWindshieldBack.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftWindshieldBack.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
