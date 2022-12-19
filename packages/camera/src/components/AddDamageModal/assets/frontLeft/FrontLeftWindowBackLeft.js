import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_WINDOW_BACK_LEFT_WIDTH = 30;
export const FRONT_LEFT_WINDOW_BACK_LEFT_HEIGHT = 46;
export const FRONT_LEFT_WINDOW_BACK_LEFT_TOP = 8;
export const FRONT_LEFT_WINDOW_BACK_LEFT_LEFT = 275;

export default function FrontLeftWindowBackLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_WINDOW_BACK_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_WINDOW_BACK_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_WINDOW_BACK_LEFT_WIDTH}
        height={FRONT_LEFT_WINDOW_BACK_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 30 46"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M19.987 4.36C12.354.817 8.123.363.627 1.131c4.212 14.953 5.24 24.743 5.378 44.1l23.663-13.983-9.68-26.89Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftWindowBackLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftWindowBackLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
