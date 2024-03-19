import { useContext, useMemo } from 'react';
import { MonitoringAdapter } from '../adapters';
import { MonitoringContext } from './context';

/**
 * Custom hook that allows you to access the Monitoring Context methods inside a component.
 */
export function useMonitoring(): MonitoringAdapter {
  const adapter = useContext(MonitoringContext);

  return useMemo(
    () => ({
      setUserId: adapter.setUserId.bind(adapter),
      log: adapter.log.bind(adapter),
      handleError: adapter.handleError.bind(adapter),
      createTransaction: adapter.createTransaction.bind(adapter),
    }),
    [],
  );
}
