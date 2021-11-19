import React from 'react';

import { Animated, ViewPropTypes } from 'react-native';

export default function Placeholder({ style }) {
  const bgColorAnim = React.useRef(new Animated.Value(0)).current;

  const interpolateColor = bgColorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#e0e0e0', '#c6c6c6', '#e0e0e0'],
  });
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(bgColorAnim, {
          toValue: 2,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
      {
        iterations: 1000,
      },
    ).start();
  }, [bgColorAnim]);

  return <Animated.View style={[{ backgroundColor: interpolateColor }, style]} />;
}
Placeholder.propTypes = {
  style: ViewPropTypes.style,
};

Placeholder.defaultProps = {
  style: {},
};
