import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_WINDSHIELD_BACK_WIDTH = 108;
export const REAR_RIGHT_WINDSHIELD_BACK_HEIGHT = 59;
export const REAR_RIGHT_WINDSHIELD_BACK_TOP = 25;
export const REAR_RIGHT_WINDSHIELD_BACK_LEFT = 11;

export default function RearRightWindshieldBack({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_WINDSHIELD_BACK_TOP + offsetTop,
          left: REAR_RIGHT_WINDSHIELD_BACK_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_WINDSHIELD_BACK_WIDTH}
        height={REAR_RIGHT_WINDSHIELD_BACK_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 108 59"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M0.190186 38.813L31.8578 3.54678C44.914 0.417532 52.8772 0.138783 67.8438 1.38763C90.9459 3.02489 99.7446 4.39503 107.428 7.14538C109.287 15.8373 94.416 32.7585 75.0409 57.5257C61.0965 59.1345 51.8794 58.7152 31.8578 54.6468L16.024 51.0482C7.07008 48.4742 2.29868 46.8271 0.190186 38.813Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightWindshieldBack.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightWindshieldBack.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
