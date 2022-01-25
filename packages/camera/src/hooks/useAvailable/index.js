import { useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import Constants from '../../const';

export function getOS() {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}

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
        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(Platform.OS, getOS()); }

        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Awaiting for camera availability...`); }

        const isAvailable = await ExpoCamera.isAvailableAsync();

        if (isAvailable) {
          setAvailable(true);
          // eslint-disable-next-line no-console
          if (!Constants.PRODUCTION) { console.log(`Camera is available!`); }
          // eslint-disable-next-line no-console
        } else if (!Constants.PRODUCTION) { console.error(`Camera is not available!`); }
      })();
    } else if (!available) {
      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log(`Camera is always available`); }
      setAvailable(true);
    }
  }, [available, isAlwaysAvailable]);

  return available;
};

export default useAvailable;
