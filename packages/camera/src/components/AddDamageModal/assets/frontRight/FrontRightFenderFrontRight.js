import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_FENDER_FRONT_RIGHT_WIDTH = 85;
export const FRONT_RIGHT_FENDER_FRONT_RIGHT_HEIGHT = 89;
export const FRONT_RIGHT_FENDER_FRONT_RIGHT_TOP = 69;
export const FRONT_RIGHT_FENDER_FRONT_RIGHT_LEFT = 86;

export default function FrontRightFenderFrontRight({
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
          top: FRONT_RIGHT_FENDER_FRONT_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_FENDER_FRONT_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_FENDER_FRONT_RIGHT_WIDTH}
        height={FRONT_RIGHT_FENDER_FRONT_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 85 89"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M84.2163 64.8997C66.7413 46.3747 61.1858 38.5531 62.7047 31.5567C45.8773 25.1897 35.6452 22.1004 22.9081 13.2717C20.4178 8.33425 20.0362 5.48608 20.7569 0.364746L3.54758 7.89383C-1.13866 32.3321 -0.182673 50.1153 4.62317 85.3358L12.1523 88.5626C7.69789 68.3422 7.07584 58.4821 18.6058 50.9172C31.5023 49.1002 41.5177 57.9364 62.7047 85.3358L84.2163 64.8997Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightFenderFrontRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightFenderFrontRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
