import { useCallback, useLayoutEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Platform, Dimensions } from 'react-native';

/**
 * ScreenOrientation.getOrientationLockAsync or
 * Dimensions comparison:
 * height bigger or equals the width means orientation is portrait
 */
const getNativeOrientationOrFallbackToDimensions = (o) => {
  if (o) { return o; }

  const dim = Dimensions.get('screen');
  if (dim.height >= dim.width) { return 1; }

  return 0;
};

const isNative = Platform.select({ native: true, web: false });

export default () => {
  const [value, setValue] = useState();

  const rotateToLandscape = useCallback((onSuccess) => ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
  ).then(onSuccess), []);

  const rotateToPortrait = useCallback((onSuccess) => ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP,
  ).then(onSuccess), []);

  const isNotSupported = !isNative || value === null;
  const isNotLandscape = value !== 4 && value !== 3;

  useLayoutEffect(() => {
    if (isNotSupported) { return undefined; }

    // unlock any current orientation lock
    ScreenOrientation.unlockAsync();

    // check if screen orientation is supported
    ScreenOrientation.supportsOrientationLockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
    )
      .then(() => setValue(0))
      .catch(() => setValue(null));

    // set initial orientation
    ScreenOrientation.getOrientationLockAsync().then((o) => {
      setValue(getNativeOrientationOrFallbackToDimensions(o));
    });

    // subscribe to future changes
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => setValue(event.orientationInfo.orientation),
    );

    // return a cleanup function to unsubscribe from notifications
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, [isNotSupported]);

  return {
    rotateToLandscape,
    rotateToPortrait,
    isNotLandscape,
    isNotSupported,
    value,
  };
};
