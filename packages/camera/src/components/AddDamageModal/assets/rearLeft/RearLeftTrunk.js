import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_TRUNK_WIDTH = 152;
export const REAR_LEFT_TRUNK_HEIGHT = 166;
export const REAR_LEFT_TRUNK_TOP = 11;
export const REAR_LEFT_TRUNK_LEFT = 169;

export default function RearLeftTrunk({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_TRUNK_TOP + offsetTop,
          left: REAR_LEFT_TRUNK_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_TRUNK_WIDTH}
        height={REAR_LEFT_TRUNK_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 152 166"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M109.861 13.2281C114.398 12.4193 115.073 11.1413 109.861 6.03095C87.0718 2.76526 74.6706 1.4923 53.7228 0.99292L27.813 3.15208C7.49469 6.64306 1.07318 11.0895 1.18335 18.9859C-1.35269 27.2071 18.9086 42.5886 53.7228 69.3662L73.1553 88.0789L114.179 84.4803C118.814 87.9918 114.929 90.398 108.421 100.314C99.4068 110.954 90.7205 113.419 78.1933 116.148C71.6733 130.845 72.6215 136.838 78.1933 145.656L76.0341 165.809C104.409 153.736 115.425 146.49 130.733 128.383C134.027 125.452 136.82 119.441 140.809 107.511C143.062 96.247 142.768 93.8307 140.809 93.1169L143.688 86.6395L135.051 91.6775L137.93 98.8747L112.02 117.587L108.421 107.511L113.46 101.754L140.089 88.0789C143.667 86.8897 146.452 81.1048 150.165 71.5254C152.851 66.5664 150.918 62.4 140.809 52.8127C140.042 67.9069 80.1314 76.9829 67.3975 71.2296C54.6637 65.4762 33.5483 28.1124 32.851 20.4253C64.7525 13.8364 81.8433 12.5085 109.861 17.5465C108.427 15.4482 108.55 14.5489 109.861 13.2281Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftTrunk.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftTrunk.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
