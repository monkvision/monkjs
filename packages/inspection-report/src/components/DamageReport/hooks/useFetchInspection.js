import { useCallback, useEffect, useState } from 'react';
import monk from '@monkvision/corejs';
import useProcessInspection from './useProcessInspection';

const DEFAULT_FETCH_INTERVAL_MS = 2000;

export default function useFetchInspection({
  inspectionId,
  fetchInterval = DEFAULT_FETCH_INTERVAL_MS,
}) {
  const [shouldFetch, setShouldFetch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const {
    processInspection,
    resetState,
    isInspectionReady,
    pictures,
    damages,
    setDamages,
  } = useProcessInspection();

  const retry = useCallback(() => {
    setShouldFetch(true);
    setIsLoading(true);
    setIsError(false);
    resetState();
  }, [resetState]);

  const onSuccess = useCallback((result) => {
    setIsError(false);
    setIsLoading(false);
    processInspection(result.axiosResponse);
  }, [processInspection]);

  const onError = useCallback((err) => {
    console.error(err);
    setIsError(true);
    setIsLoading(false);
    setShouldFetch(false);
    resetState();
  }, [resetState]);

  const request = useCallback(() => monk.entity.inspection.getOne(inspectionId), [inspectionId]);

  useEffect(() => {
    request().then(onSuccess).catch(onError);
    const interval = setInterval(() => {
      if (shouldFetch && !isInspectionReady) {
        request().then(onSuccess).catch(onError);
      }
    }, fetchInterval);
    return () => clearInterval(interval);
  }, [shouldFetch, isInspectionReady]);

  return {
    isLoading,
    isError,
    retry,
    isInspectionReady,
    pictures,
    damages,
    setDamages,
  };
}
