import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';

function defaultShouldFetch({ loading, count, updatedAt }) {
  return !loading && count === 0 && updatedAt === null;
}

export default function useRequestState(
  request,
  onRequestSuccess,
  shouldFetch = defaultShouldFetch,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paging, setPaging] = useState({ cursors: {} });
  const [count, setCount] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(null);

  const catchLoadingError = useCallback((e) => {
    setLoading(false);
    setUpdatedAt(moment().unix());
    setError(e);
  }, [setLoading, setError]);

  const setSuccess = useCallback((response) => {
    setLoading(false);
    setUpdatedAt(moment().unix());
    setError(null);
    setPaging(response.axiosResponse.data?.paging);
  }, [setLoading, setError]);

  const requestState = useMemo(
    () => ({ loading, error, paging, updatedAt, count }),
    [count, error, loading, paging, updatedAt],
  );

  const requestSetState = {
    setLoading,
    setError,
    setPaging,
    setUpdatedAt,
    catchLoadingError,
    setSuccess,
    setCount,
  };

  const startRequest = useCallback(async () => {
    setLoading(true);
    setCount((prevCount) => prevCount + 1);

    try {
      const response = await request();
      setSuccess(response);

      if (typeof onRequestSuccess === 'function') {
        onRequestSuccess(response);
      }

      return response;
    } catch (e) {
      catchLoadingError(e);
    }

    return null;
  }, [catchLoadingError, onRequestSuccess, request, setSuccess]);

  useEffect(() => {
    if (typeof request === 'function' && shouldFetch(requestState)) {
      startRequest();
    }
  }, [request, requestState, shouldFetch, startRequest]);

  return [requestState, requestSetState, startRequest];
}
