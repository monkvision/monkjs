import { DependencyList, useEffect } from 'react';
import { PromiseHandlers } from '@monkvision/types';

/**
 * Custom hook that can be used to run asyncrhonous effects. It is similar to `useEffect` but makes sure to not execute
 * the effect handlers if the effect's Promise resolves after the current component as been dismounted.
 */
export function useAsyncEffect<T = void>(
  effect: () => Promise<T>,
  deps: DependencyList | undefined,
  handlers?: Partial<PromiseHandlers<T>>,
): void {
  useEffect(() => {
    let isActive = true;
    effect()
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
          handlers?.onComplete?.();
        }
      });
    return () => {
      isActive = false;
    };
  }, deps);
}
