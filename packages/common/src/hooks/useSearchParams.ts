import { useMemo } from 'react';

/**
 * Custom hook used to fetch search params from the current window URL.
 */
export function useSearchParams() {
  return useMemo(() => new URL(window.location.toString()).searchParams, []);
}
