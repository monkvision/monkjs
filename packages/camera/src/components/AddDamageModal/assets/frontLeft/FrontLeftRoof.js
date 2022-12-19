import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_ROOF_WIDTH = 138;
export const FRONT_LEFT_ROOF_HEIGHT = 113;
export const FRONT_LEFT_ROOF_TOP = 1;
export const FRONT_LEFT_ROOF_LEFT = 157;

export default function FrontLeftRoof({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_ROOF_TOP + offsetTop,
          left: FRONT_LEFT_ROOF_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_ROOF_WIDTH}
        height={FRONT_LEFT_ROOF_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 138 113"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M.939 11.008c28.422-4.026 48.941-3.858 94.99 1.45l7.252-6.526 12.327-3.625 21.753 3.625-15.952-5.8h-20.304l-62.36 2.175C9.22 3.652 3.306 5.885.939 11.008Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftRoof.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftRoof.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
