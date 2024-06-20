import { useEffect } from 'react';

/**
 * Hook that prevents the user from leaving the page without confirmation.
 * @example
 * ```tsx
 * import { usePreventExit } from '@monkvision/common';
 *
 * function MyComponent() {
 *  usePreventExit();
 *  return <div>My Component</div>;
 * }
 * ```
 */
export function usePreventExit() {
  useEffect(() => {
    window.onbeforeunload = () => {
      return 'Are you sure you want to leave?';
    };
    return () => {
      window.onbeforeunload = null;
    };
  }, []);
}
