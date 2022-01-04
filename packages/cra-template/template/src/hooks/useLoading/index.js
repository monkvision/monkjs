import { useState } from 'react';
import useTimeout from 'hooks/useTimeout';

export default function useLoading(isLoading, timeout = 750) {
  const [minLoading, setMinLoading] = useState(true);
  useTimeout(() => setMinLoading(false), timeout);

  return Boolean(isLoading === true || minLoading);
}
