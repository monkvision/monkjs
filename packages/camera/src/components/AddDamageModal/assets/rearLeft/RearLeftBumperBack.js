import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_LEFT_BUMPER_BACK_WIDTH = 148;
export const REAR_LEFT_BUMPER_BACK_HEIGHT = 96;
export const REAR_LEFT_BUMPER_BACK_TOP = 122;
export const REAR_LEFT_BUMPER_BACK_LEFT = 170;

export default function RearLeftBumperBack({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_LEFT_BUMPER_BACK_TOP + offsetTop,
          left: REAR_LEFT_BUMPER_BACK_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_LEFT_BUMPER_BACK_WIDTH}
        height={REAR_LEFT_BUMPER_BACK_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 148 96"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M37.6091 64.8846L46.2458 59.1268C61.2439 58.3891 67.9021 57.5434 75.0345 54.8085C81.4239 52.8959 85.053 51.2621 91.5881 47.6113C100.884 43.1963 106.088 39.8301 115.339 32.4972C125.386 23.5788 129.561 18.9009 135.491 10.9057L138.37 0.82959C144.449 4.14678 146.298 7.30805 147.006 15.224C145.723 23.7821 143.08 29.9971 135.491 43.293C129.104 53.8398 122.2 60.6666 107.422 73.5212C91.3673 86.7031 82.8891 93.2147 73.5951 95.1128L59.2007 94.393C55.794 96.596 47.7623 95.51 32.5711 93.6733C19.5164 91.498 13.6713 89.395 6.66124 83.5973L0.903488 71.362L19.6162 77.8395C25.0665 79.851 27.5887 79.1296 31.1317 74.9606L37.6091 64.8846Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearLeftBumperBack.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearLeftBumperBack.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
