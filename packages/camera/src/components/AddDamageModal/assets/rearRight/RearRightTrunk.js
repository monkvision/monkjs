import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_TRUNK_WIDTH = 152;
export const REAR_RIGHT_TRUNK_HEIGHT = 166;
export const REAR_RIGHT_TRUNK_TOP = 11;
export const REAR_RIGHT_TRUNK_LEFT = 0;

export default function RearRightTrunk({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_TRUNK_TOP + offsetTop,
          left: REAR_RIGHT_TRUNK_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_TRUNK_WIDTH}
        height={REAR_RIGHT_TRUNK_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 152 166"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M42.1392 13.2281C37.6026 12.4193 36.9273 11.1413 42.1392 6.03095C64.9283 2.76526 77.3295 1.4923 98.2773 0.99292L124.187 3.15208C144.505 6.64306 150.927 11.0895 150.817 18.9859C153.353 27.2071 133.092 42.5886 98.2773 69.3662L78.8449 88.0789L37.8209 84.4803C33.1864 87.9918 37.0715 90.398 43.5786 100.314C52.5934 110.954 61.2796 113.419 73.8068 116.148C80.3268 130.845 79.3787 136.838 73.8068 145.656L75.966 165.809C47.5908 153.736 36.5752 146.49 21.2674 128.383C17.9728 125.452 15.1802 119.441 11.1913 107.511C8.93818 96.247 9.23171 93.8307 11.1913 93.1169L8.31242 86.6395L16.949 91.6775L14.0702 98.8747L39.98 117.587L43.5786 107.511L38.5406 101.754L11.911 88.0789C8.33324 86.8897 5.5482 81.1048 1.83495 71.5254C-0.851362 66.5664 1.08217 62.4 11.1913 52.8127C11.9583 67.9069 71.8687 76.9829 84.6026 71.2296C97.3365 65.4762 118.452 28.1124 119.149 20.4253C87.2477 13.8364 70.1568 12.5085 42.1392 17.5465C43.5729 15.4482 43.4497 14.5489 42.1392 13.2281Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightTrunk.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightTrunk.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
