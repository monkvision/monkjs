import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const FRONT_RIGHT_WINDSHIELD_FRONT_WIDTH = 156;
export const FRONT_RIGHT_WINDSHIELD_FRONT_HEIGHT = 67;
export const FRONT_RIGHT_WINDSHIELD_FRONT_TOP = 9;
export const FRONT_RIGHT_WINDSHIELD_FRONT_LEFT = 61;

export default function FrontRightWindshieldFront({
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
          top: FRONT_RIGHT_WINDSHIELD_FRONT_TOP + offsetTop,
          left: FRONT_RIGHT_WINDSHIELD_FRONT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_WINDSHIELD_FRONT_WIDTH}
        height={FRONT_RIGHT_WINDSHIELD_FRONT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 156 67"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M7.037 4.435.583 7.662C14.05 26.06 20.062 39.793 29.624 66.819l19.36-7.53c32.625 1.696 51.808 1.893 106.483-15.058C135.008 26.418 121.85 16.352 98.461 3.36 65.983-1.186 44.94.63 7.037 4.435Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightWindshieldFront.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightWindshieldFront.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
