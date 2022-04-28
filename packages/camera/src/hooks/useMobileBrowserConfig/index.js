import { useEffect, useLayoutEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

import { useMediaQuery } from 'react-responsive';

/**
 * Let's assign `DEFAULT_MATCH_MEDIA_OBJECT` object to `window.mathMedia`
 * just to handle platforms that don't support this method.
 * NOTE: This won't work using `Platform.select`.
 *  */

const isWeb = Platform.OS === 'web';
const isMobileBrowserUserAgent = window.mobileCheck;

/**
 * @param {function} onRotateToPortrait - Will be called once the device get into Portrait
 * Orientation (mobile only)
 * @returns {boolean}
 */
const useMobileBrowserConfig = (onRotateToPortrait) => {
  const { height, width } = useWindowDimensions();
  const isMobileSize = useMediaQuery({ query: '(max-width: 480px)' });

  const [webIsPortrait, setWebIsPortrait] = useState((window.innerWidth < window.innerHeight)
     && window.innerWidth <= 480);

  const isPortrait = isWeb ? webIsPortrait : width < height;

  useLayoutEffect(() => {
    if (!isWeb) { return undefined; }

    const handleGetResizeBounds = () => setWebIsPortrait(
      window.innerWidth < window.innerHeight && window.innerWidth <= 480,
    );

    window.addEventListener('resize', handleGetResizeBounds);
    return () => window.removeEventListener('resize', handleGetResizeBounds);
  }, []);

  /**
   * As long as the `userAgent` string is user configurable
   * We can add another condition layer for detecting a mobile browser
   * which is using `window.matchMedia`
   */
  useEffect(() => {
    if (isMobileBrowserUserAgent && isMobileSize && isPortrait && Boolean(onRotateToPortrait)) {
      onRotateToPortrait();
    }
  }, [isMobileSize, isPortrait, onRotateToPortrait]);

  if (!isWeb) { return false; }
  return isPortrait && isMobileBrowserUserAgent && isMobileSize;
};

export default useMobileBrowserConfig;
