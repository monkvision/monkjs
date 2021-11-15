/* eslint-disable no-alert */
import React from 'react';
import { useWindowDimensions } from 'react-native';

const DEFAULT_MACTH_MEDIA_OBJECT = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
});
/**
 * Let's assign `DEFAULT_MACTH_MEDIA_OBJECT` object to `window.mathMedia`
 * just to handle platforms that doesn't support this method.
 * NOTE: This won't work using `Platform.select`.
 *  */
window.matchMedia = window.matchMedia || DEFAULT_MACTH_MEDIA_OBJECT;

const MOBILE_USERAGENT_PATTERN = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const MEDIA_QUERY = window.matchMedia('(max-width: 480px)');

const useMobileBrowserConfig = () => {
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
    if (isMobileBrowserUserAgent && isPortrait && isMobileSize) {
      alert(`For better experience, please rotate your device to landscape.`);
    }
  }, [isPortrait, isMobileBrowserUserAgent, isMobileSize]);
  return isMobileBrowserUserAgent && isPortrait && isMobileSize;
};

export default useMobileBrowserConfig;
