import { useMemo, useState } from 'react';

/**
 * To compile multiple events into a single event.
 *
 * with it own merge logic and emit the merged value.
 * NOTE: we can do if needed.
 */
export function useMergeMultipleEvent<R, T extends string>(allState: Array<T>, emitter: Function) {
  type Result = Array<R>;
  const [result, setResult] = useState<Record<T, Result>>(
    allState.reduce((x, i) => {
      x[i] = [] as Result;
      return x;
    }, {} as Partial<Record<T, Result>>) as Record<T, Result>,
  );
  const calculatedValue = useMemo(() => {
    const mergedValue = Object.entries<Result>(result).reduce(
      (x, i) =>
        i[1].reduce((x, i) => {
          return x.includes(i) ? x : [...x, i];
        }, x),
      [] as Result,
    );
    emitter(mergedValue);
    return mergedValue;
  }, [result]);
  return [
    calculatedValue,
    (state: T) => {
      return (value: Result) => {
        setResult({ ...result, [state]: value });
      };
    },
  ] as const;
}
