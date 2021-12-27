import React from 'react';

import { Animated, Platform } from 'react-native';
import PropTypes from 'prop-types';

export default function Placeholder({ style }) {
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;

  const interpolateOpacity = opacityAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.2, 1, 0.2],
  });
  const startAnimation = React.useCallback(() => {
    opacityAnimation.setValue(0);
    Animated.timing(opacityAnimation, {
      toValue: 2,
      duration: 2000,
      useNativeDriver: Platform.select({ web: false, native: true }),
    }).start((result) => {
      if (result.finished) {
        startAnimation();
      }
    });
  }, [opacityAnimation]);

  const stopAnimation = React.useCallback(() => {
    opacityAnimation.stopAnimation();
  }, [opacityAnimation]);

  React.useEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, [startAnimation, stopAnimation]);

  return (
    <Animated.View style={[{
      opacity: interpolateOpacity,
      backgroundColor: '#c6c6c6',
    }, style]}
    />
  );
}
/**
 * The style prop might be object or number, We put Proptypes.number
 * because react native optimize the process by
 * caching the stylesheet and simply sends the cached ID.
 */
Placeholder.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

Placeholder.defaultProps = {
  style: {},
};
