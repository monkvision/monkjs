import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_WINDOW_BACK_LEFT_WIDTH = 65;
export const REAR_LEFT_WINDOW_BACK_LEFT_HEIGHT = 54;
export const REAR_LEFT_WINDOW_BACK_LEFT_TOP = 16;
export const REAR_LEFT_WINDOW_BACK_LEFT_LEFT = 59;

export default function RearLeftWindowBackLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_WINDOW_BACK_LEFT_TOP + offsetTop,
          left: REAR_LEFT_WINDOW_BACK_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_WINDOW_BACK_LEFT_WIDTH}
        height={REAR_LEFT_WINDOW_BACK_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 65 54"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M13.3022 1.03114C31.3926 -0.714525 41.6544 0.0219257 60.084 3.1903L64.4023 52.1312C43.6763 54.3039 28.3606 53.1665 0.347305 50.6917L13.3022 1.03114Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftWindowBackLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftWindowBackLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
