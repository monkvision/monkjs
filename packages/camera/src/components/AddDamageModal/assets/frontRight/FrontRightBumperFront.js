import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_BUMPER_FRONT_WIDTH = 166;
export const FRONT_RIGHT_BUMPER_FRONT_HEIGHT = 131;
export const FRONT_RIGHT_BUMPER_FRONT_TOP = 88;
export const FRONT_RIGHT_BUMPER_FRONT_LEFT = 148;

export default function FrontRightBumperFront({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_BUMPER_FRONT_TOP + offsetTop,
          left: FRONT_RIGHT_BUMPER_FRONT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_BUMPER_FRONT_WIDTH}
        height={FRONT_RIGHT_BUMPER_FRONT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 166 131"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M156.222 0.915527C153.12 11.4954 140.958 19.0649 95.0033 36.358L110.04 48.1721C117.711 54.4607 108.351 54.7464 99.2994 57.8383C63.5656 56.4656 44.4146 55.2157 23.0444 46.0241L0.490112 66.4304C9.87218 80.335 13.775 92.7443 19.8224 117.983C35.0319 127.023 44.8711 128.735 62.7829 130.871C89.741 131.057 105.22 127.533 134.742 102.947C146.632 91.9457 150.821 86.9351 150.852 81.4666L134.742 97.5768L136.89 85.7626L126.15 90.0587C117.454 88.496 112.873 87.1674 108.965 78.2445C115.39 70.5083 120.447 66.0608 132.594 57.8383C145.831 52.3119 154.926 46.8621 165.888 35.284V8.43362L156.222 0.915527Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightBumperFront.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightBumperFront.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
