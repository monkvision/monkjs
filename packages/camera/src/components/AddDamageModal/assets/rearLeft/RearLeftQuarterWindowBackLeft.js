import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_QUARTER_WINDOW_BACK_LEFT_WIDTH = 47;
export const REAR_LEFT_QUARTER_WINDOW_BACK_LEFT_HEIGHT = 50;
export const REAR_LEFT_QUARTER_WINDOW_BACK_LEFT_TOP = 19;
export const REAR_LEFT_QUARTER_WINDOW_BACK_LEFT_LEFT = 119;

export default function RearLeftQuarterWindowBackLeft({
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
          top: REAR_LEFT_QUARTER_WINDOW_BACK_LEFT_TOP + offsetTop,
          left: REAR_LEFT_QUARTER_WINDOW_BACK_LEFT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_QUARTER_WINDOW_BACK_LEFT_WIDTH}
        height={REAR_LEFT_QUARTER_WINDOW_BACK_LEFT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 47 50"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M4.40219 49.8508C5.12193 49.1311 0.0838737 0.190186 0.0838737 0.190186C21.5311 7.70791 32.0894 15.1902 46.8656 37.6156C47.4586 43.2785 3.68245 50.5705 4.40219 49.8508Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftQuarterWindowBackLeft.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftQuarterWindowBackLeft.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
