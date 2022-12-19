import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_ROCKER_PANEL_RIGHT_WIDTH = 65;
export const FRONT_RIGHT_ROCKER_PANEL_RIGHT_HEIGHT = 52;
export const FRONT_RIGHT_ROCKER_PANEL_RIGHT_TOP = 102;
export const FRONT_RIGHT_ROCKER_PANEL_RIGHT_LEFT = 26;

export default function FrontRightRockerPanelRight({
  offsetTop,
  offsetLeft,
  onPress,
  isDisplayed,
}) {
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
          top: FRONT_RIGHT_ROCKER_PANEL_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_ROCKER_PANEL_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_ROCKER_PANEL_RIGHT_WIDTH}
        height={FRONT_RIGHT_ROCKER_PANEL_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 65 52"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M0.499756 0.598877L18.1606 12.6404L63.825 44.4304L64.5501 51.6816L18.9634 19.0625L3.71083 7.02102L0.499756 0.598877Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightRockerPanelRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightRockerPanelRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
