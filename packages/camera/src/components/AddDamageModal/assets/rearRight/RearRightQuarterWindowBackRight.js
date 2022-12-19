import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_QUARTER_WINDOW_BACK_RIGHT_WIDTH = 47;
export const REAR_RIGHT_QUARTER_WINDOW_BACK_RIGHT_HEIGHT = 50;
export const REAR_RIGHT_QUARTER_WINDOW_BACK_RIGHT_TOP = 19;
export const REAR_RIGHT_QUARTER_WINDOW_BACK_RIGHT_LEFT = 155;

export default function RearRightQuarterWindowBackRight({
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
          top: REAR_RIGHT_QUARTER_WINDOW_BACK_RIGHT_TOP + offsetTop,
          left: REAR_RIGHT_QUARTER_WINDOW_BACK_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_QUARTER_WINDOW_BACK_RIGHT_WIDTH}
        height={REAR_RIGHT_QUARTER_WINDOW_BACK_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 47 50"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M42.5977 49.8508C41.8779 49.1311 46.916 0.190186 46.916 0.190186C25.4687 7.70791 14.9104 15.1902 0.134244 37.6156C-0.458768 43.2785 43.3174 50.5705 42.5977 49.8508Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightQuarterWindowBackRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightQuarterWindowBackRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
