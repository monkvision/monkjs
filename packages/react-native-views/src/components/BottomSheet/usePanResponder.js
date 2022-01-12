import noop from 'lodash.noop';
import { useCallback, useRef } from 'react';
import { Animated, PanResponder, Platform, useWindowDimensions } from 'react-native';

const config = { duration: 250, useNativeDriver: Platform.OS !== 'web' };

// onFinish will be called when the animation finished (only when closing the bottom sheet)
const usePanResponder = ({ onClose = noop, lock }) => {
  const { height } = useWindowDimensions();
  const ANIMATED = { HIDDEN: height, VISIBLE: 10 };

  const pan = useRef(new Animated.Value(ANIMATED.HIDDEN)).current;

  const visible = useCallback(
    () => Animated.spring(pan, { toValue: ANIMATED.VISIBLE, ...config }).start(),
    [ANIMATED.VISIBLE, pan],
  );

  const hidden = useCallback(
    (onFinish = noop) => Animated.timing(pan, { toValue: ANIMATED.HIDDEN, ...config })
      .start(onFinish), [ANIMATED.HIDDEN, pan],
  );

  const onMoveShouldSetPanResponder = (_, gestureState) => gestureState.dy >= 10
   || gestureState.dy >= -10;

  const panGesture = PanResponder.create({
    onPanResponderMove: (_, gestureState) => {
      Animated.event([null, { dy: pan }], { useNativeDriver: false })(_, gestureState);
    },
    onPanResponderRelease: (_, gestureState) => {
      const gestureLimitArea = ANIMATED.HIDDEN / 3;
      const gestureDistance = gestureState.dy;

      if (gestureDistance > gestureLimitArea && !lock) {
        onClose();
      } else {
        visible();
      }
    },
    onMoveShouldSetPanResponder,
    onStartShouldSetPanResponderCapture: onMoveShouldSetPanResponder,
  });
  return { pan, panGesture, animate: { visible, hidden } };
};
export default usePanResponder;
