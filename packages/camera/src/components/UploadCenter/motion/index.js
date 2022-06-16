import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Motion = () => {};

function Initiator({ children, style, extraData, maxOpacity, minOpacity, ...props }) {
  const opacityMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityMotion, { toValue: minOpacity, useNativeDriver: true, duration: 50 })
      .start(
        () => Animated.timing(opacityMotion, { toValue: maxOpacity, useNativeDriver: true })
          .start(),
      );
  }, [...extraData]);

  return (
    <Animated.View style={StyleSheet.flatten([style, { opacity: opacityMotion }])} {...props}>
      {children}
    </Animated.View>
  );
}
Initiator.propTypes = {
  extraData: PropTypes.array,
  maxOpacity: PropTypes.number,
  minOpacity: PropTypes.number,
};
Initiator.defaultProps = {
  extraData: [],
  maxOpacity: 1,
  minOpacity: 0.6,
};
Motion.Initiator = Initiator;
export default Motion;
