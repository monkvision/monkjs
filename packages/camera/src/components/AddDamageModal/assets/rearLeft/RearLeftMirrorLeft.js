import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_MIRROR_LEFT_WIDTH = 22;
export const REAR_LEFT_MIRROR_LEFT_HEIGHT = 16;
export const REAR_LEFT_MIRROR_LEFT_TOP = 49;
export const REAR_LEFT_MIRROR_LEFT_LEFT = 5;

export default function RearLeftMirrorLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_MIRROR_LEFT_TOP + offsetTop,
          left: REAR_LEFT_MIRROR_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_MIRROR_LEFT_WIDTH}
        height={REAR_LEFT_MIRROR_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 22 16"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M12.604 1.85762C16.2708 -0.747261 17.9621 0.334575 20.5209 5.45622L21.2406 11.9337C19.9564 15.2759 14.7083 14.9862 7.56594 15.5323C2.99758 12.1131 1.61357 10.2492 1.08847 8.33509C0.191738 3.20318 5.99841 3.3697 12.604 1.85762Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftMirrorLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftMirrorLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
