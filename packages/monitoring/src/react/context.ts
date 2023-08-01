import { createContext } from 'react';
import { MonitoringAdapter, EmptyMonitoringAdapter } from '../adapters';

/**
 * A React Context that wraps up the monitoring methods provided by a Monitoring Adapter. This context is initialized by
 * default with the EmptyMonitoringAdapter.
 */
export const MonitoringContext = createContext<MonitoringAdapter>(new EmptyMonitoringAdapter());
