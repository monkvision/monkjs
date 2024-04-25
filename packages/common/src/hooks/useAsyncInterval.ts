import { useEffect, useLayoutEffect, useRef } from 'react';
import { PromiseHandlers } from '@monkvision/types';

/**
 * This custom hook creates an interval that calls the provided async callback every `delay` milliseconds if the
 * previous call isn't still running. If `delay` is `null` or less than 0, the callback will not be called. The
 * promise handlers provided will only be called while the component is still mounted.
 */
export function useAsyncInterval<T>(
  callback: () => Promise<T>,
  delay: number | null,
  handlers?: Partial<PromiseHandlers<T>>,
): void {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let isActive = true;
    let isRunning = false;

    if (delay === null || delay < 0) {
      return () => {};
    }

    const intervalId = setInterval(() => {
      if (!isRunning) {
        isRunning = true;
        callbackRef
          .current()
          .then((res) => {
            if (isActive) {
              handlers?.onResolve?.(res);
            }
          })
          .catch((err) => {
            if (isActive) {
              handlers?.onReject?.(err);
            }
          })
          .finally(() => {
            if (isActive) {
              isRunning = false;
              handlers?.onComplete?.();
            }
          });
      }
    }, delay);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [delay]);
}
