import React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import {
  DEFAULT_MATCH_MEDIA_OBJECT,
  MOBILE_MAX_WIDTH,
  MOBILE_USERAGENT_PATTERN,
} from '../constants';

/**
 * Let's assign `DEFAULT_MACTH_MEDIA_OBJECT` object to `window.mathMedia`
 * just to handle platforms that doesn't support this method.
 * NOTE: This won't work using `Platform.select`.
 *  */
window.matchMedia = window.matchMedia || DEFAULT_MATCH_MEDIA_OBJECT;
const MEDIA_QUERY = window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

/**
 * @param {function} onRotateToPortrait - Will be called once the device get into Portrait
 * Orientation (mobile only)
 * @returns {boolean}
 */
const useMobileBrowserConfig = (onRotateToPortrait) => {
  const { height, width } = useWindowDimensions();

  const isPortrait = width < height;
  const isMobileBrowserUserAgent = MOBILE_USERAGENT_PATTERN.test(navigator.userAgent);
  const isMobileSize = MEDIA_QUERY?.matches;

  /**
   * As long as the `userAgent` string is user configureable
   * We can add another condition layer for detecting a mobile browser
   * which is using `window.matchMedia`
   */

  React.useEffect(() => {
    if (isMobileBrowserUserAgent && isPortrait && isMobileSize && Boolean(onRotateToPortrait)) {
      onRotateToPortrait();
    }
  }, [isMobileBrowserUserAgent, isPortrait, isMobileSize, onRotateToPortrait]);
  return Platform.select({
    native: false,
    default: isMobileBrowserUserAgent && isPortrait && isMobileSize,
  });
};

export default useMobileBrowserConfig;
