import { useCallback, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function useAnim() {
  const useNativeDriver = Platform.OS !== 'web';
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver,
    }).start();
  }, [fadeAnim, useNativeDriver]);

  const fadeOut = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver,
    }).start();
  }, [fadeAnim, useNativeDriver]);

  useFocusEffect(() => {
    fadeIn();
  });

  return { fadeIn, fadeOut, fadeAnim };
}
