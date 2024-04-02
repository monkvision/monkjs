import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * This custom hook creates an interval that calls the provided callback every `delay` milliseconds. If `delay` is
 * `null` or less than 0, the callback will not be called.
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay < 0) {
      return () => {};
    }

    const intervalId = setInterval(() => {
      callbackRef.current();
    }, delay);

    return () => {
      clearInterval(intervalId);
    };
  }, [delay]);
}
