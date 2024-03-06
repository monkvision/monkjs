import { useLayoutEffect, useState } from 'react';
import { PixelDimensions } from '@monkvision/types';

/**
 * Object describing the dimensions of the browser window.
 */
export interface WindowDimensions extends PixelDimensions {
  /**
   * Boolean indicatin if the window is in portrait mode (height > width) or not.
   */
  isPortrait: boolean;
}

/**
 * Custom hook used to listen to the browser window resize event and keep track of the current dimensions of the
 * inner window.
 */
export function useWindowDimensions(): WindowDimensions | null {
  const [dimensions, setDimensions] = useState<WindowDimensions | null>(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
        isPortrait: window.innerHeight - window.innerWidth > 0,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}
