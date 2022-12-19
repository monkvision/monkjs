import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_ROOF_WIDTH = 138;
export const FRONT_RIGHT_ROOF_HEIGHT = 13;
export const FRONT_RIGHT_ROOF_TOP = 2;
export const FRONT_RIGHT_ROOF_LEFT = 26;

export default function FrontRightRoof({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_ROOF_TOP + offsetTop,
          left: FRONT_RIGHT_ROOF_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_ROOF_WIDTH}
        height={FRONT_RIGHT_ROOF_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 138 13"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M137.061 11.0081C108.639 6.98178 88.1196 7.15049 42.0706 12.4584L34.8194 5.93231L22.4924 2.30671L0.73877 5.93231L16.6914 0.131348H36.9948L99.355 2.30671C128.779 3.65226 134.694 5.88497 137.061 11.0081Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightRoof.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightRoof.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
