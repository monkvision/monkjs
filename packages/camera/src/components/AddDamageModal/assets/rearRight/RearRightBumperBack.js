import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const REAR_RIGHT_BUMPER_BACK_WIDTH = 148;
export const REAR_RIGHT_BUMPER_BACK_HEIGHT = 96;
export const REAR_RIGHT_BUMPER_BACK_TOP = 122;
export const REAR_RIGHT_BUMPER_BACK_LEFT = 3;

export default function RearRightBumperBack({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: REAR_RIGHT_BUMPER_BACK_TOP + offsetTop,
          left: REAR_RIGHT_BUMPER_BACK_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={REAR_RIGHT_BUMPER_BACK_WIDTH}
        height={REAR_RIGHT_BUMPER_BACK_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 148 96"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M110.391 64.8846L101.754 59.1268C86.7561 58.3891 80.0978 57.5434 72.9654 54.8085C66.576 52.8959 62.9469 51.2621 56.4119 47.6113C47.116 43.1963 41.9115 39.8301 32.6612 32.4972C22.6143 23.5788 18.4393 18.9009 12.509 10.9057L9.63016 0.82959C3.55139 4.14678 1.70217 7.30805 0.99353 15.224C2.2769 23.7821 4.92042 29.9971 12.509 43.293C18.8961 53.8398 25.7999 60.6666 40.5781 73.5212C56.6327 86.7031 65.1108 93.2147 74.4048 95.1128L88.7992 94.393C92.2059 96.596 100.238 95.51 115.429 93.6733C128.483 91.498 134.329 89.395 141.339 83.5973L147.096 71.362L128.384 77.8395C122.933 79.851 120.411 79.1296 116.868 74.9606L110.391 64.8846Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

RearRightBumperBack.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

RearRightBumperBack.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
