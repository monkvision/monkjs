import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_FENDER_BACK_LEFT_WIDTH = 136;
export const REAR_LEFT_FENDER_BACK_LEFT_HEIGHT = 180;
export const REAR_LEFT_FENDER_BACK_LEFT_TOP = 22;
export const REAR_LEFT_FENDER_BACK_LEFT_LEFT = 112;

export default function RearLeftFenderBackLeft({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_FENDER_BACK_LEFT_TOP + offsetTop,
          left: REAR_LEFT_FENDER_BACK_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_FENDER_BACK_LEFT_WIDTH}
        height={REAR_LEFT_FENDER_BACK_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 136 180"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M19.3192 0.788574L58.1841 2.22801C55.0142 11.612 62.028 19.7742 81.9348 36.7745L110.724 58.3661L129.436 76.359H94.8897C78.5092 74.8157 67.4898 72.5677 58.1841 76.359C61.3152 88.1984 66.4203 93.5433 77.6165 102.269C87.8482 108.145 93.8074 109.924 104.966 109.466L135.194 105.148C130.351 118.496 130.358 125.112 135.194 135.376L107.845 146.172C99.4248 159.522 93.2779 171.109 88.4122 174.241C86.0399 183.635 75.0471 177.444 59.6235 171.362C36.4257 129.831 23.4553 110.264 0.606552 105.148C2.21204 78.1376 4.1745 64.457 12.1221 46.1309C34.8387 43.4355 47.8247 41.9856 54.5855 35.3351C46.3983 21.6328 39.6599 14.0315 19.3192 0.788574Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftFenderBackLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftFenderBackLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
