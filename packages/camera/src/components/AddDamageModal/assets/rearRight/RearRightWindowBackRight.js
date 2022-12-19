import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_WINDOW_BACK_RIGHT_WIDTH = 65;
export const REAR_RIGHT_WINDOW_BACK_RIGHT_HEIGHT = 54;
export const REAR_RIGHT_WINDOW_BACK_RIGHT_TOP = 16;
export const REAR_RIGHT_WINDOW_BACK_RIGHT_LEFT = 197;

export default function RearRightWindowBackRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_WINDOW_BACK_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_WINDOW_BACK_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_WINDOW_BACK_RIGHT_WIDTH}
        height={REAR_RIGHT_WINDOW_BACK_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 65 54"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M51.6977 1.03114C33.6073 -0.714525 23.3455 0.0219257 4.91597 3.1903L0.597656 52.1312C21.3237 54.3039 36.6393 53.1665 64.6526 50.6917L51.6977 1.03114Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightWindowBackRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightWindowBackRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
