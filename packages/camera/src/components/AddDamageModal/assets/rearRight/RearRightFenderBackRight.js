import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_FENDER_BACK_RIGHT_WIDTH = 136;
export const REAR_RIGHT_FENDER_BACK_RIGHT_HEIGHT = 180;
export const REAR_RIGHT_FENDER_BACK_RIGHT_TOP = 22;
export const REAR_RIGHT_FENDER_BACK_RIGHT_LEFT = 73;

export default function RearRightFenderBackRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_FENDER_BACK_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_FENDER_BACK_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_FENDER_BACK_RIGHT_WIDTH}
        height={REAR_RIGHT_FENDER_BACK_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 136 180"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M116.681 0.788574L77.8158 2.22801C80.9857 11.612 73.9719 19.7742 54.0651 36.7745L25.2763 58.3661L6.56366 76.359H41.1102C57.4907 74.8157 68.5101 72.5677 77.8158 76.359C74.6847 88.1984 69.5796 93.5433 58.3834 102.269C48.1517 108.145 42.1925 109.924 31.0341 109.466L0.805908 105.148C5.64891 118.496 5.64144 125.112 0.805908 135.376L28.1552 146.172C36.5751 159.522 42.722 171.109 47.5876 174.241C49.96 183.635 60.9527 177.444 76.3764 171.362C99.5741 129.831 112.545 110.264 135.393 105.148C133.788 78.1376 131.825 64.457 123.878 46.1309C101.161 43.4355 88.1752 41.9856 81.4144 35.3351C89.6016 21.6328 96.34 14.0315 116.681 0.788574Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightFenderBackRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightFenderBackRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
