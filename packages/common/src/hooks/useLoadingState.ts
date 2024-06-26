import { useCallback, useState } from 'react';
import { useObjectMemo } from './useObjectMemo';

/**
 * An object containing data about a task.
 */
export interface LoadingState {
  /**
   * Boolean indicating if the task is running.
   */
  isLoading: boolean;
  /**
   * This field will contain the error that occurred during the task. If no error has occurred, or if the task has not
   * completed yet, this field is `null`.
   */
  error: unknown | null;
  /**
   * Callback used to indicate that the task has started.
   */
  start: () => void;
  /**
   * Callback used to indicate that the task has completed successfully.
   */
  onSuccess: () => void;
  /**
   * Callback used to indicate that an error occurred during the task.
   */
  onError: (err?: unknown) => void;
}

/**
 * Custom hook used to create a `LoadingState` object. This object can be used to track the processing of a task in
 * the component. For instance, you can use this hook to handle the loading and errors of API calls in your components.
 *
 * @param [startsLoading] Boolean indicating if the loading state starts in loading mode or not.
 */
export function useLoadingState(startsLoading?: boolean): LoadingState {
  const [isLoading, setIsLoading] = useState(!!startsLoading);
  const [error, setError] = useState<unknown | null>(null);

  const start = useCallback(() => {
    setError(null);
    setIsLoading(true);
  }, []);

  const onSuccess = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  const onError = useCallback((err?: unknown) => {
    setError(err);
    setIsLoading(false);
  }, []);

  return useObjectMemo({
    isLoading,
    error,
    start,
    onSuccess,
    onError,
  });
}
