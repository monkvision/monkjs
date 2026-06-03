import { useCallback, useRef } from 'react';
import { filterAlphaJumps } from '../utils/orientation.utils';

/**
 * Handle returned by the useFilteredAlpha hook to manage the filtering of alpha values.
 */
export interface UseFilteredAlphaHandle {
  /**
   * Function to get the filtered alpha value based on the current raw alpha reading.
   *
   * @returns The filtered alpha value that accounts for potential sensor anomalies.
   */
  getFilteredAlpha: (alpha: number) => number;
}

/**
 * Custom hook used to filter out anomalous jumps (sudden spikes) in the alpha values
 * from the device orientation sensor that are not caused by actual device rotation.
 */
export function useFilteredAlpha(): UseFilteredAlphaHandle {
  const prevAlphaRef = useRef<number>(0);
  const filteredAlphaRef = useRef<number>(0);

  const getFilteredAlpha = useCallback((alpha: number) => {
    const filtered = filterAlphaJumps(alpha, prevAlphaRef.current, filteredAlphaRef.current);
    prevAlphaRef.current = alpha;
    filteredAlphaRef.current = filtered;

    return filtered;
  }, []);

  return {
    getFilteredAlpha,
  };
}
