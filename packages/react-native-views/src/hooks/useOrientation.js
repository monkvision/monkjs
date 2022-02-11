import * as ScreenOrientation from 'expo-screen-orientation';
import { useLayoutEffect, useState } from 'react';
import { Platform, Dimensions } from 'react-native';

/**
 * "getNativeOrientationOrFallbackToDimensions"
 * Because `ScreenOrientation.getOrientationLockAsync` does not fire at the first render sometimes
 * we can fallback to:
 * If height is bigger or equals the width then the orientation is portrait (value=1)
 */
const getNativeOrientationOrFallbackToDimensions = (o) => {
  if (o) { return o; }
  const dim = Dimensions.get('screen');
  if (dim.height >= dim.width) { return 1; } return 0;
};

const isNative = Platform.select({ native: true, web: false });

export default () => {
  const [orientation, setOrientation] = useState();

  const handleRotateToLandscape = () => ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
  );

  const handleRotateToPortrait = () => ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.PORTRAIT_UP,
  );

  const isNotSupported = !isNative || orientation === null;

  useLayoutEffect(() => {
    if (isNotSupported) { return undefined; }

    // unlock any current orientation lock
    ScreenOrientation.unlockAsync();

    // check if screen orientation is supported
    ScreenOrientation.supportsOrientationLockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
    )
      .then(() => setOrientation(0))
      .catch(() => setOrientation(null));

    // set initial orientation
    ScreenOrientation.getOrientationLockAsync().then((o) => {
      setOrientation(getNativeOrientationOrFallbackToDimensions(o));
    });

    // subscribe to future changes
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => setOrientation(event.orientationInfo.orientation),
    );

    // return a clean up function to unsubscribe from orientation
    return () => ScreenOrientation.removeOrientationChangeListener(subscription);
  }, [isNotSupported]);

  return [orientation, {
    landscape: handleRotateToLandscape,
    portrait: handleRotateToPortrait,
  }, isNotSupported];
};
