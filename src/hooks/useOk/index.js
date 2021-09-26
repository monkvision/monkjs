import isEmpty from 'lodash.isempty';
import isFunction from 'lodash.isfunction';
import { useMemo } from 'react';

const defaultArg1 = (data) => !isEmpty(data);

export default function useOk(data, func = defaultArg1, arg2 = true, arg3 = null) {
  if (!isFunction(func)) {
    throw Error('useOk(data, ...args) arg1 should be a function');
  }

  return useMemo(
    () => (func(data) ? arg2 : arg3),
    [arg2, arg3, data, func],
  );
}
