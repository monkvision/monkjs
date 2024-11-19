import { useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook returning a ref to a util function returning `true` if the component using the hook is mounted, and false
 * otherwise.
 */
export function useIsMounted(): () => boolean {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return useCallback(() => isMounted.current, []);
}
