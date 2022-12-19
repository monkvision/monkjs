import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_ROCKER_PANEL_RIGHT_WIDTH = 73;
export const REAR_RIGHT_ROCKER_PANEL_RIGHT_HEIGHT = 53;
export const REAR_RIGHT_ROCKER_PANEL_RIGHT_TOP = 114;
export const REAR_RIGHT_ROCKER_PANEL_RIGHT_LEFT = 218;

export default function RearRightRockerPanelRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_ROCKER_PANEL_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_ROCKER_PANEL_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_ROCKER_PANEL_RIGHT_WIDTH}
        height={REAR_RIGHT_ROCKER_PANEL_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 73 53"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M72.8808 0.192871L3.06808 41.9366L0.189209 52.0126C30.0564 35.1976 46.1007 25.3266 70.7217 5.2309L72.8808 0.192871Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightRockerPanelRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightRockerPanelRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
