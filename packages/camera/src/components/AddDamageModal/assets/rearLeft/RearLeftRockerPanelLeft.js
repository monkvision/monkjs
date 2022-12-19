import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_ROCKER_PANEL_LEFT_WIDTH = 73;
export const REAR_LEFT_ROCKER_PANEL_LEFT_HEIGHT = 53;
export const REAR_LEFT_ROCKER_PANEL_LEFT_TOP = 115;
export const REAR_LEFT_ROCKER_PANEL_LEFT_LEFT = 30;

export default function RearLeftRockerPanelLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_ROCKER_PANEL_LEFT_TOP + offsetTop,
          left: REAR_LEFT_ROCKER_PANEL_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_ROCKER_PANEL_LEFT_WIDTH}
        height={REAR_LEFT_ROCKER_PANEL_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 73 53"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M0.119064 0.192871L69.9318 41.9366L72.8107 52.0126C42.9435 35.1976 26.8991 25.3266 2.27822 5.2309L0.119064 0.192871Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftRockerPanelLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftRockerPanelLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
