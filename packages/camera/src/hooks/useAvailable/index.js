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
  const [available, setAvailable] = useState(Platform.OS !== 'web');

  const isAlwaysAvailable = useMemo(() => (
    Platform.OS !== 'web' && getOS() !== 'iOS'
  ), []);

  useEffect(() => {
    if (!isAlwaysAvailable && !available && Platform.OS === 'web') {
      (async () => {
        const isAvailable = await ExpoCamera.isAvailableAsync();

        if (isAvailable) {
          setAvailable(true);
        } else {
          setAvailable(false);
          log([`Error in \`useAvailable()\`: Camera is not available`], 'error');
        }
      })();
    }
  }, [available, isAlwaysAvailable]);

  return available;
};

export default useAvailable;
