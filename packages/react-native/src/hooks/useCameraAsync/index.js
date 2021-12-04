import { Camera } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import utils from '../../components/utils';

/**
 * @returns {[unknown, {isAvailable: null, hasPermission: null, isLockInLandscape: null}]}
 */
export default function useCameraAsync({ lockOrientationOnRender }) {
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
      const { status } = await Camera.requestCameraPermissionsAsync();

      const isAvailable = isAlwaysAvailable || await Camera.isAvailableAsync();

      const isLockInLandscape = (Platform.OS === 'web' && utils.getOS() === 'iOS')
        || (lockOrientationOnRender && (!isNative || await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
        )));

      setCameraAsync({
        hasPermission: status === 'granted',
        isAvailable,
        isLockInLandscape,
      });
    })();

    return () => {
      if (isNative) {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
          .then(() => ScreenOrientation.unlockAsync());
      }
    };
  }, [isAlwaysAvailable, isNative, lockOrientationOnRender]);

  return [cameraCanMount, cameraAsync];
}
