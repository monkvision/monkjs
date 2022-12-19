import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_ROCKER_PANEL_LEFT_WIDTH = 65;
export const FRONT_LEFT_ROCKER_PANEL_LEFT_HEIGHT = 52;
export const FRONT_LEFT_ROCKER_PANEL_LEFT_TOP = 102;
export const FRONT_LEFT_ROCKER_PANEL_LEFT_LEFT = 229;

export default function FrontLeftRockerPanelLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_ROCKER_PANEL_LEFT_TOP + offsetTop,
          left: FRONT_LEFT_ROCKER_PANEL_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_ROCKER_PANEL_LEFT_WIDTH}
        height={FRONT_LEFT_ROCKER_PANEL_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 65 52"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M64.5.599 46.84 12.64 1.175 44.43.45 51.682l45.587-32.62L61.289 7.021 64.5.599Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftRockerPanelLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftRockerPanelLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
