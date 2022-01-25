import { useEffect } from 'react';
import { Platform } from 'react-native';

import useWindowDimensions from '../useWindowDimensions';

import Constants from '../../const';

/**
 * Let's assign `DEFAULT_MATCH_MEDIA_OBJECT` object to `window.mathMedia`
 * just to handle platforms that doesn't support this method.
 * NOTE: This won't work using `Platform.select`.
 *  */
window.matchMedia = window.matchMedia || Constants.DEFAULT_MATCH_MEDIA_OBJECT;
const MEDIA_QUERY = window.matchMedia(`(max-width: ${Constants.MOBILE_MAX_WIDTH}px)`);

/**
 * @param {function} onRotateToPortrait - Will be called once the device get into Portrait
 * Orientation (mobile only)
 * @returns {boolean}
 */
const useMobileBrowserConfig = (onRotateToPortrait) => {
  const { height, width } = useWindowDimensions();
  const isPortrait = width < height;
  const isMobileBrowserUserAgent = Constants.MOBILE_USERAGENT_PATTERN.test(navigator.userAgent);
  const isMobileSize = MEDIA_QUERY?.matches;

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
