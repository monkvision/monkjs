import { useMemo } from 'react';

/**
 * This custom hook is used to have a more handy way of memoizing a record of values.
 *
 * @example
 * import { useMemo } from 'React';
 * import { useObjectMemo } from '@monkvision/common';
 *
 * // These 2 lines are equivalent
 * const foo = useMemo(() => ({ bar, baz }), [bar, baz]);
 * const foo = useObjectMemo({ bar, baz });
 */
export function useObjectMemo<T extends Record<string, unknown>>(object: T): T {
  return useMemo(() => object, Object.values(object));
}
