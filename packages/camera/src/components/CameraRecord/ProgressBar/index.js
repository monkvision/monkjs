import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle as SVGCircle } from 'react-native-svg';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    transform: [{ rotate: '-90deg' }],
  },
  circle: {
    position: 'absolute',
    zIndex: 99,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    position: 'absolute',
  },
});

const AnimateCircle = Animated.createAnimatedComponent(SVGCircle);

export default function CircularProgress({ duration, radius, color }) {
  const circleCircumstance = 2 * Math.PI * radius;
  const strokeDashoffset = useRef(new Animated.Value(circleCircumstance)).current;

  const fulfill = () => Animated.timing(strokeDashoffset, {
    toValue: 0,
    useNativeDriver: true,
    duration,
  }).start();

  useEffect(() => {
    fulfill();
  }, []);

  if (!radius) { return null; }

  return (
    <View style={styles.root}>
      <Svg width="140" height="140" viewBox="0 0 140 140" fill="none">
        <AnimateCircle
          cx="70"
          cy="70"
          r={radius}
          stroke={color}
          strokeWidth={3}
          strokeDasharray={circleCircumstance}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

CircularProgress.propTypes = {
  color: PropTypes.string,
  duration: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
};

CircularProgress.defaultProps = {
  color: '#FFF',
};
