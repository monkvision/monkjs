import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';

/**
 * @returns {[unknown, {isAvailable: null, hasPermission: null, isLockInLandscape: null}]}
 */
export default function useCameraAsync() {
  const isNative = useMemo(
    () => Platform.select({ native: true, default: false }),
    [],
  );

  const [cameraAsync, setCameraAsync] = useState({
    hasPermission: null,
    // isAvailable: null, // isAvailable was causing issues on Android web apps
    isLockInLandscape: null,
  });

  const cameraCanMount = useMemo(() => {
    const {
      hasPermission,
      // isAvailable,
      isLockInLandscape,
    } = cameraAsync;

    // return hasPermission && isAvailable && isLockInLandscape;
    return hasPermission && isLockInLandscape;
  }, [cameraAsync]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      // const isAvailable = isNative || await Camera.isAvailableAsync();
      const isLockInLandscape = !isNative || await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      setCameraAsync({
        hasPermission: status === 'granted',
        // isAvailable,
        isLockInLandscape,
      });
    })();

    return () => {
      if (isNative) {
        ScreenOrientation.unlockAsync(
          ScreenOrientation.Orientation.PORTRAIT_UP,
        );
      }
    };
  }, [isNative]);

  return [cameraCanMount, cameraAsync];
}
