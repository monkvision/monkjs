import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';
import noop from 'functions/noop';

/**
 * Hooks initiating camera on mount with async results.
 * 1. async for permissions
 * 2. async for availability
 * 3. lock screen orientation
 * @returns {{ hasPermission: boolean, isAvailable: boolean }}
 */
export default function useCameraAsync() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isAvailable, setAvailable] = useState(null);

  useEffect(() => {
    (async () => {
      // PERMISSIONS
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');

      // AVAILABILITY
      setAvailable(
        ['android', 'ios'].includes(Platform.OS)
        || await Camera.isAvailableAsync(),
      );
    })();

    if (!['android', 'ios'].includes(Platform.OS)) {
      return noop;
    }

    async function changeScreenOrientation() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    }

    changeScreenOrientation();
    return () => ScreenOrientation.unlockAsync();
  }, []);

  return { hasPermission, isAvailable };
}
