import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_LEFT_GRILL_RADIATOR_WIDTH = 65;
export const FRONT_LEFT_GRILL_RADIATOR_HEIGHT = 69;
export const FRONT_LEFT_GRILL_RADIATOR_TOP = 111;
export const FRONT_LEFT_GRILL_RADIATOR_LEFT = -1;

export default function FrontLeftGrillRadiator({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_LEFT_GRILL_RADIATOR_TOP + offsetTop,
          left: FRONT_LEFT_GRILL_RADIATOR_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_LEFT_GRILL_RADIATOR_WIDTH}
        height={FRONT_LEFT_GRILL_RADIATOR_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 65 69"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M8 30.5.5 0C7.23 18 26.78 31.064 42.15 37.882l22.587 17.21c-4.145 8.473-8.09 11.07-17.21 12.907-4.83.468-7.633-.502-12.907-4.303L33.5 60.5C21.63 53.08 16.775 50.551 8 30.5Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontLeftGrillRadiator.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontLeftGrillRadiator.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
