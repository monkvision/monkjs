import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';

import utils from '../../components/utils';

/**
 * @returns {[unknown, {isAvailable: null, hasPermission: null, isLockInLandscape: null}]}
 */
export default function useCameraAsync() {
  const isNative = useMemo(
    () => Platform.select({ native: true, default: false }),
    [],
  );

  const isAlwaysAvailable = useMemo(
    () => Platform.OS !== 'web' && utils.getOS() !== 'iOS',
    [],
  );

  const [cameraAsync, setCameraAsync] = useState({
    hasPermission: null,
    isAvailable: isAlwaysAvailable,
    isLockInLandscape: null,
  });

  const cameraCanMount = useMemo(() => {
    const {
      hasPermission,
      isAvailable,
      isLockInLandscape,
    } = cameraAsync;

    return hasPermission && isAvailable && isLockInLandscape;
  }, [cameraAsync]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      const isAvailable = isAlwaysAvailable || await Camera.isAvailableAsync();
      const isLockInLandscape = !isNative || await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      setCameraAsync({
        hasPermission: status === 'granted',
        isAvailable,
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
  }, [isAlwaysAvailable, isNative]);

  return [cameraCanMount, cameraAsync];
}
