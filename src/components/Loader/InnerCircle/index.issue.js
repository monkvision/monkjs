import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Path } from 'react-native-svg';

import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function InnerCircle({ animated }) {
  const radius = useSharedValue(10);

  const animatedProps = useAnimatedProps(() => {
    const path = `
    M 50, 50
    m -${radius.value}, 0
    a ${radius.value},${radius.value} 0 1,0 ${radius.value * 2},0
    a ${radius.value},${radius.value} 0 1,0 ${-radius.value * 2},0
    `;

    return {
      d: path,
    };
  });

  useEffect(() => {
    if (animated) {
      radius.value = withRepeat(withTiming(30, {
        duration: 700,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }), -1, true);
    } else {
      cancelAnimation(radius);
      radius.value = 10;
    }
  }, [animated, radius]);

  return (
    <AnimatedPath
      animatedProps={animatedProps}
      fill="black"
    />
  );
}

InnerCircle.propTypes = {
  animated: PropTypes.bool,
};

InnerCircle.defaultProps = {
  animated: false,
};
