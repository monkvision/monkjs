import * as ScreenOrientation from 'expo-screen-orientation';
import { useLayoutEffect, useState } from 'react';
import { Platform } from 'react-native';

const isNative = Platform.select({ native: true, web: false });

export default () => {
  const [orientation, setOrientation] = useState();

  const handleRotateToLandscape = () => ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
  );

  const isNotSupported = !isNative || orientation === null;

  useLayoutEffect(() => {
    if (isNotSupported) { return undefined; }

    // unlock any current orientation lock
    ScreenOrientation.unlockAsync();

    // set initial orientation
    ScreenOrientation.getOrientationLockAsync().then((_, o) => {
      setOrientation(o);
    });

    // check if screen orientation is supported
    ScreenOrientation.supportsOrientationLockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
    )
      .then(() => setOrientation(true))
      .catch(() => setOrientation(null));

    // subscribe to future changes
    const subscription = ScreenOrientation.addOrientationChangeListener(
      (event) => setOrientation(event.orientationInfo.orientation),
    );

    // return a clean up function to unsubscribe from notifications
    return () => ScreenOrientation.removeOrientationChangeListener(subscription);
  }, [isNotSupported]);

  return [orientation, handleRotateToLandscape, isNotSupported];
};
