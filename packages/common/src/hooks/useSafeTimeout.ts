import { useCallback, useEffect, useRef } from 'react';

/**
 * A custom hook that provides a safe way to use setTimeout.
 */
export function useSafeTimeout() {
  const isMounted = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((callback: () => void, delay: number) => {
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current) {
        callback();
      }
    }, delay);
  }, []);
}
