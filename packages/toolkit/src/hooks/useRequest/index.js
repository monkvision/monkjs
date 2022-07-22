import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';

export function defaultCanRequest({ loading }) { return !loading; }

/**
 * @param request
 * @param onRequestSuccess
 * @param onRequestFailure
 * @param canRequest
 * @return {{
 * start: ((function(*): Promise<null|*>)|*),
 * setters: {
 * catchLoadingError: ((function(*): void)|*),
 * setSuccess: ((function(*): void)|*),
 * setLoading: (value: (((prevState: boolean) => boolean) | boolean)) => void,
 * setError: (value: unknown) => void,
 * setPaging: (value: (((prevState: {cursors: {}}) => {cursors: {}}) | {cursors: {}})) => void,
 * setUpdatedAt: (value: unknown) => void,
 * setCount: (value: (((prevState: number) => number) | number)) => void
 * },
 * state: {
 * count: number,
 * paging: {cursors: {}},
 * loading: boolean,
 * error: unknown,
 * updatedAt: unknown
 * }}}
 */
export default function useRequest({
  request,
  onRequestSuccess,
  onRequestFailure,
  canRequest = defaultCanRequest,
}) {
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

  const startRequest = useCallback(async (params) => {
    if (loading || !canRequest(requestState)) { return null; }

    setLoading(true);
    setCount((prevCount) => prevCount + 1);

    try {
      const response = await request(params);
      setSuccess(response);

      if (typeof onRequestSuccess === 'function') {
        onRequestSuccess(response, params);
      }

      return response;
    } catch (e) {
      if (typeof onRequestFailure === 'function') {
        onRequestFailure(e);
      }

      catchLoadingError(e);
    }

    return null;
  }, [catchLoadingError, onRequestSuccess, request, requestState, setSuccess, canRequest]);

  return { state: requestState, start: startRequest, setters: requestSetState };
}
