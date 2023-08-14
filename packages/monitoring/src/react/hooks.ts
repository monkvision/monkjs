import { useContext } from 'react';
import { MonitoringAdapter } from '../adapters';
import { MonitoringContext } from './context';

/**
 * Custom hook that allows you to access the Monitoring Context methods inside a component.
 */
export function useMonitoring(): MonitoringAdapter {
  return useContext(MonitoringContext);
}
