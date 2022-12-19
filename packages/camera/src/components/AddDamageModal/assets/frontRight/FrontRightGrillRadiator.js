import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_GRILL_RADIATOR_WIDTH = 65;
export const FRONT_RIGHT_GRILL_RADIATOR_HEIGHT = 69;
export const FRONT_RIGHT_GRILL_RADIATOR_TOP = 110;
export const FRONT_RIGHT_GRILL_RADIATOR_LEFT = 256;

export default function FrontRightGrillRadiator({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_GRILL_RADIATOR_TOP + offsetTop,
          left: FRONT_RIGHT_GRILL_RADIATOR_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_GRILL_RADIATOR_WIDTH}
        height={FRONT_RIGHT_GRILL_RADIATOR_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 65 69"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M57 30.5L64.5 0C57.7696 18 38.2215 31.0642 22.8509 37.8824L0.263672 55.0917C4.40842 63.5648 8.35298 66.1612 17.473 67.9987C22.3029 68.4668 25.1061 67.4971 30.38 63.6964L31.5 60.5C43.3712 53.0798 48.2255 50.5513 57 30.5Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightGrillRadiator.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightGrillRadiator.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
