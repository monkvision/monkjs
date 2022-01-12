import noop from 'lodash.noop';
import { useRef } from 'react';
import { Animated, PanResponder, Platform, useWindowDimensions } from 'react-native';

// onFinish will be called when the animation finished (only when closing the drawer)
const usePanResponder = ({ onClose = noop, lock }) => {
  const { height } = useWindowDimensions();
  const ANIMATED = { HIDDEN: height, VISIBLE: 10 };

  const pan = useRef(new Animated.Value(ANIMATED.HIDDEN)).current;

  const animate = (toValue, type = 'spring') => {
    const config = { duration: 250, toValue, useNativeDriver: Platform.OS !== 'web' };
    return Animated[type](pan, config);
  };

  const visible = () => animate(ANIMATED.VISIBLE, 'spring').start();
  const hidden = (onFinish = noop) => animate(ANIMATED.HIDDEN, 'timing').start(onFinish);

  const onPanResponderMove = (_, gestureState) => {
    Animated.event([null, { dy: pan }], {
      useNativeDriver: false,
    })(_, gestureState);
  };

  const onMoveShouldSetPanResponder = (_, gestureState) => gestureState.dy >= 10
   || gestureState.dy >= -10;

  const onPanResponderRelease = (_, gestureState) => {
    const gestureLimitArea = ANIMATED.HIDDEN / 3;
    const gestureDistance = gestureState.dy;

    if (gestureDistance > gestureLimitArea && !lock) {
      onClose();
    } else {
      visible();
    }
  };

  const panGesture = PanResponder.create({
    onPanResponderMove,
    onPanResponderRelease,
    onMoveShouldSetPanResponder,
    onStartShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
  });
  return { pan, panGesture, animate: { visible, hidden } };
};
export default usePanResponder;
