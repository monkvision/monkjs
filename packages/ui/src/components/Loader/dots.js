import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import Proptypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

const { useNativeDriver } = utils;
const styles = StyleSheet.create({
  loading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default function Dots({ dots, colors, dotSize, bounceHeight, borderRadius }) {
  const [animations, setAnimations] = useState([]);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dotAnimations = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < dots; i++) {
      dotAnimations.push(new Animated.Value(0));
    }
    setAnimations(dotAnimations);
  }, [dots]);

  const handleOpacityAnimation = useCallback(() => {
    Animated.timing(opacity, { toValue: 1, easing: Easing.ease, useNativeDriver }).start();
  }, [opacity]);

  const handleSequeceAnimation = useCallback((node, delay) => {
    const floatSequence = Animated.sequence([
      Animated.timing(node, { toValue: 0, duration: 400, delay, useNativeDriver }),
      Animated.timing(node, { toValue: bounceHeight, duration: 400, delay, useNativeDriver }),
      Animated.timing(node, { toValue: 0, delay, duration: 400, useNativeDriver }),
    ]);
    return floatSequence;
  }, [bounceHeight]);

  const handleParallelAnimation = useCallback((nodes) => {
    Animated.parallel(nodes.map((node, index) => handleSequeceAnimation(node, index * 60)))
      .start(() => { handleParallelAnimation(animations); });
  }, [handleSequeceAnimation, animations]);

  useEffect(() => {
    if (animations.length === 0) { return; }
    handleParallelAnimation(animations);
  }, [animations, handleParallelAnimation]);

  useEffect(() => {
    if (animations.length === 0) { return; }
    handleOpacityAnimation();
  }, [animations, handleOpacityAnimation, handleParallelAnimation]);

  return (
    <Animated.View style={[styles.loading, { opacity }]}>
      {animations.map((animation, index) => (
        <Animated.View
          // eslint-disable-next-line react/no-array-index-key
          key={`loading-anim-${index}`}
          style={[
            { width: dotSize, height: dotSize, borderRadius: borderRadius || dotSize / 2 },
            { backgroundColor: colors[index] || '#274b9f' },
            { transform: [{ translateY: animation }] },
          ]}
        />
      ))}
    </Animated.View>
  );
}

Dots.propTypes = {
  borderRadius: Proptypes.number,
  bounceHeight: Proptypes.number,
  colors: Proptypes.arrayOf(Proptypes.string),
  dots: Proptypes.number,
  dotSize: Proptypes.number,
};
Dots.defaultProps = {
  dots: 4,
  colors: ['#274b9f', '#3261CD', '#84A0E1', '#D6DFF5'],
  dotSize: 20,
  bounceHeight: 20,
  borderRadius: null,
};
