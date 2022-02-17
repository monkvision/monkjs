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

  // respond to a touch move only if the distance between the original touch value and the
  // new current touch value is more than 10 or less than -10
  const onMoveShouldSetPanResponder = (_, gestureState) => gestureState.dy >= 10
   || gestureState.dy >= -10;

  const panGesture = PanResponder.create({
    onPanResponderMove: (_, gestureState) => {
      // follow the touch move vertically only if the moveY is more than 100
      // which means the bottomSheet will not get dragged up for a value under 100
      if (gestureState.moveY > 100) {
        Animated.event([null, { dy: pan }], { useNativeDriver: false })(_, gestureState);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      // if the distance between the original value and the new value that we got
      // when the user releases his touch is more than 30% of the HIDDEN value which
      // is by default (height of the screen), then close it else open it
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
