import { useEffect, useMemo } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';
import Constants from '../../const';

function getOS() {
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
 * Let's assign `DEFAULT_MATCH_MEDIA_OBJECT` object to `window.mathMedia`
 * just to handle platforms that doesn't support this method.
 * NOTE: This won't work using `Platform.select`.
 *  */
window.matchMedia = window.matchMedia || Constants.DEFAULT_MATCH_MEDIA_OBJECT;
const MEDIA_QUERY = window.matchMedia(`(max-width: ${Constants.MOBILE_MAX_WIDTH}px)`);

/**
 * @param {function} onAvailable - Will be called once the device get available
 * @param {function} onRotateToPortrait - Will be called once the device get into Portrait
 * Orientation (mobile only)
 * @returns {boolean}
 */
const useMobileBrowserConfig = (onAvailable, onRotateToPortrait) => {
  const { height, width } = useWindowDimensions();

  const isPortrait = width < height;
  const isMobileBrowserUserAgent = Constants.MOBILE_USERAGENT_PATTERN.test(navigator.userAgent);
  const isMobileSize = MEDIA_QUERY?.matches;
  const isAlwaysAvailable = useMemo(() => Platform.OS !== 'web' && getOS() !== 'iOS', []);

  /**
   * Check availability Web only
   * https://docs.expo.dev/versions/latest/sdk/camera/#cameraisavailableasync-boolean
   * Beware of obscure behavior on iOS mobile browsers
   */
  useEffect(() => {
    if (!isAlwaysAvailable) {
      (async () => {
        // eslint-disable-next-line no-console
        if (!Constants.PRODUCTION) { console.log(`Awaiting for camera availability...`); }

        const isAvailable = await ExpoCamera.isAvailableAsync();

        if (isAvailable) {
          onAvailable(isAvailable);
          // eslint-disable-next-line no-console
          if (!Constants.PRODUCTION) { console.log(`Camera is available!`); }
          // eslint-disable-next-line no-console
        } else if (!Constants.PRODUCTION) { console.error(`Camera is not available!`); }
      })();
    } else {
      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log(`Camera is always available`); }
      onAvailable(true);
    }
  }, [isAlwaysAvailable, onAvailable]);

  /**
   * As long as the `userAgent` string is user configurable
   * We can add another condition layer for detecting a mobile browser
   * which is using `window.matchMedia`
   */
  useEffect(() => {
    if (isMobileBrowserUserAgent && isPortrait && isMobileSize && Boolean(onRotateToPortrait)) {
      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log(`Screen orientation rotating to portrait...`); }

      onRotateToPortrait();
    }
  }, [isMobileBrowserUserAgent, isPortrait, isMobileSize, onRotateToPortrait]);

  return Platform.select({
    native: false,
    default: isMobileBrowserUserAgent && isPortrait && isMobileSize,
  });
};

export default useMobileBrowserConfig;
