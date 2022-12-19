import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_ROOF_WIDTH = 183;
export const REAR_LEFT_ROOF_HEIGHT = 25;
export const REAR_LEFT_ROOF_TOP = 5;
export const REAR_LEFT_ROOF_LEFT = 39;

export default function RearLeftRoof({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_ROOF_TOP + offsetTop,
          left: REAR_LEFT_ROOF_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_ROOF_WIDTH}
        height={REAR_LEFT_ROOF_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 183 25"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M132.624 18.5081C136.193 10.8461 152.42 9.14309 182.284 6.27292C152.582 3.83989 136.19 3.15188 107.433 3.39404C79.4578 0.710674 63.9412 -1.051 30.4234 4.83348C19.1166 8.10209 12.4285 13.1011 0.195251 24.9856C14.9579 14.6409 24.9065 11.4125 46.2573 10.5912C70.2931 11.3477 78.7576 13.6196 91.5995 18.5081H132.624Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftRoof.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftRoof.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
