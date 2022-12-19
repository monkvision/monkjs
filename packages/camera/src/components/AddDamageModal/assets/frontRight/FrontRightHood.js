import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_HOOD_WIDTH = 200;
export const FRONT_RIGHT_HOOD_HEIGHT = 77;
export const FRONT_RIGHT_HOOD_TOP = 48;
export const FRONT_RIGHT_HOOD_LEFT = 106;

export default function FrontRightHood({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_HOOD_TOP + offsetTop,
          left: FRONT_RIGHT_HOOD_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_HOOD_WIDTH}
        height={FRONT_RIGHT_HOOD_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 77"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M200 39.5694C176.844 19.9995 150.369 13.3334 107.672 0L110.931 5.34722C59.4068 18.5296 29.955 26.4006 2.30917 19.25C-0.519622 23.3683 -1.00957 26.1852 2.30917 33.1528C14.1407 42.4419 23.8436 45.6962 41.4129 51.3333C100.243 61.5324 123.925 67.177 137 77C176.584 61.8215 194.732 53.4645 200 39.5694Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightHood.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightHood.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
