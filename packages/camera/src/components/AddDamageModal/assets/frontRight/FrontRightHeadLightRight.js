import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_HEAD_LIGHT_RIGHT_WIDTH = 113;
export const FRONT_RIGHT_HEAD_LIGHT_RIGHT_HEIGHT = 45;
export const FRONT_RIGHT_HEAD_LIGHT_RIGHT_TOP = 100;
export const FRONT_RIGHT_HEAD_LIGHT_RIGHT_LEFT = 149;

export default function FrontRightHeadLightRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_HEAD_LIGHT_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_HEAD_LIGHT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_HEAD_LIGHT_RIGHT_WIDTH}
        height={FRONT_RIGHT_HEAD_LIGHT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 113 45"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M91.0551 23.1439C63.8664 10.7073 42.2906 3.83964 0.706113 0.556641C-0.169296 7.41062 6.07101 15.8358 20.0666 32.8241C43.9763 41.7278 61.2588 44.9276 105.038 44.6556C109.687 43.2732 112.348 42.348 112.567 40.3532C111.137 34.8308 104.269 30.8342 91.3875 23.3373L91.0551 23.1439Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightHeadLightRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightHeadLightRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
