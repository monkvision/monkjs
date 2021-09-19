import { useEffect, useState } from 'react';

export default function useMinLoadingTime(isLoading, timeout = 1250) {
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    if (isLoading === true) {
      const id = setTimeout(() => {
        setTimeoutId(null);
      }, timeout);

      setTimeoutId(id);
    }
  }, [isLoading, timeout]);

  useEffect(() => () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, [timeoutId]);

  return Boolean(isLoading === true || timeoutId);
}
