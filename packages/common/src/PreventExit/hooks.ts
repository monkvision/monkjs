import { useEffect, useMemo } from 'react';
import { createPreventExitListener } from './store';

/**
 * Custom hook that allows you
 * to access the PreventExit Context methods inside a component.
 *
 * Note : If this hook is called inside a component
 * that is not a child of a PreventExit component,
 * it will throw an error.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *  const { forceOut } = usePreventExit(true);// commonly it should be a expression.
 *  return <div onClick={() => forceOut()}>My Component</div>;
 * }
 * ```
 */
export function usePreventExit(preventExit: boolean) {
  const { cleanup, setPreventExit, allowRedirect } = useMemo(createPreventExitListener, []);
  useMemo(() => setPreventExit(preventExit), [preventExit]);
  useEffect(() => cleanup, []);
  return { allowRedirect };
}
