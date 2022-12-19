import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

export const FRONT_RIGHT_MIRROR_RIGHT_WIDTH = 41;
export const FRONT_RIGHT_MIRROR_RIGHT_HEIGHT = 21;
export const FRONT_RIGHT_MIRROR_RIGHT_TOP = 51;
export const FRONT_RIGHT_MIRROR_RIGHT_LEFT = 44;

export default function FrontRightMirrorRight({ offsetTop, offsetLeft, onPress, isDisplayed }) {
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
          top: FRONT_RIGHT_MIRROR_RIGHT_TOP + offsetTop,
          left: FRONT_RIGHT_MIRROR_RIGHT_LEFT + offsetLeft,
        },
      ]}
      pointerEvents="box-none"
    >
      <Svg
        width={FRONT_RIGHT_MIRROR_RIGHT_WIDTH}
        height={FRONT_RIGHT_MIRROR_RIGHT_HEIGHT}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 41 21"
        preserveAspectRatio="xMidYMid slice"
        pointerEvents="box-none"
        opacity={opacity}
      >
        <Path
          opacity={0.7}
          d="M36.9458 19.4405C39.6909 17.7949 40.2595 16.8544 40.1726 15.1381L33.7191 12.987V8.68462C29.8609 2.77091 27.4823 1.11505 22.9632 0.0799561C14.0342 0.268335 9.24945 1.23131 1.45157 5.45787C-0.270427 7.75539 -0.596051 9.41933 3.60274 15.1381C8.06159 21.4462 19.6281 20.0823 36.9458 19.4405Z"
          fill="#ADE0FF"
          onClick={handlePress}
        />
      </Svg>
    </View>
  );
}

FrontRightMirrorRight.propTypes = {
  isDisplayed: PropTypes.bool,
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number,
  onPress: PropTypes.func,
};

FrontRightMirrorRight.defaultProps = {
  isDisplayed: true,
  offsetLeft: 0,
  offsetTop: 0,
  onPress: () => {},
};
