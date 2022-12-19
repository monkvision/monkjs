import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_MIRROR_RIGHT_WIDTH = 22;
export const REAR_RIGHT_MIRROR_RIGHT_HEIGHT = 16;
export const REAR_RIGHT_MIRROR_RIGHT_TOP = 49;
export const REAR_RIGHT_MIRROR_RIGHT_LEFT = 294;

export default function RearRightMirrorRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_MIRROR_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_MIRROR_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_MIRROR_RIGHT_WIDTH}
        height={REAR_RIGHT_MIRROR_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 22 16"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M9.3959 1.85762C5.72903 -0.747261 4.03777 0.334575 1.479 5.45622L0.759277 11.9337C2.04343 15.2759 7.29155 14.9862 14.4339 15.5323C19.0023 12.1131 20.3863 10.2492 20.9114 8.33509C21.8081 3.20318 16.0015 3.3697 9.3959 1.85762Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightMirrorRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightMirrorRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
