import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import log from '../../utils/log';
import getOS from '../../utils/getOS';

/**
 * Check availability Web only
 * https://docs.expo.dev/versions/latest/sdk/camera/#cameraisavailableasync-boolean
 * Beware of obscure behavior on iOS mobile browsers
 */
const useAvailable = () => {
  const [available, setAvailable] = useState(false);

  const isAlwaysAvailable = useMemo(() => (
    Platform.OS !== 'web' && getOS() !== 'iOS'
  ), []);

  useEffect(() => {
    if (!isAlwaysAvailable && !available) {
      (async () => {
        log([`Awaiting for camera availability...`]);

        const isAvailable = await ExpoCamera.isAvailableAsync();

        if (isAvailable) {
          setAvailable(true);
          log([`Camera is available!`]);
        } else {
          setAvailable(false);
          // eslint-disable-next-line no-console
          console.error(`Camera is not available!`);
        }
      })();
    } else if (!available) {
      log([`Camera is always available`]);
      setAvailable(true);
    }
  }, [available, isAlwaysAvailable]);

  return available;
};

export default useAvailable;
