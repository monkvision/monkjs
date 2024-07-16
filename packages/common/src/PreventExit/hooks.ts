import { useEffect, useMemo } from 'react';
import { PreventExitListenerResult, createPreventExitListener } from './store';

/**
 * Custom hook that allows preventing the user from exiting the page or navigating away.
 *
 * @param preventExit - A boolean value indicating whether to prevent the user from exiting the page or not.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { allowRedirect } = usePreventExit(true);
 *   return <div onClick={allowRedirect}>My Component</div>;
 * }
 * ```
 */
export function usePreventExit(
  preventExit: boolean,
): Pick<PreventExitListenerResult, 'allowRedirect'> {
  const { cleanup, setPreventExit, allowRedirect } = useMemo(createPreventExitListener, []);
  useEffect(() => setPreventExit(preventExit), [preventExit]);
  useEffect(() => cleanup, []);
  return { allowRedirect };
}
