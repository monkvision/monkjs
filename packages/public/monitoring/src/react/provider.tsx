import React, { PropsWithChildren } from 'react';
import { MonitoringContext } from './context';
import { MonitoringAdapter } from '../adapters';

/**
 * Prop types of the MonitoringProvider component.
 */
export interface MonitoringProviderProps {
  /**
   * The Monitoring Adapter used in the project. You can either use one of the adapters provided by Monk or create your
   * own adapter by implementing the interface.
   */
  adapter: MonitoringAdapter;
}

/**
 * Context provider for the Monitoring Context. Place this at the root of your application in order to have access to
 * the monitoring features in your app. Inside the children of this component, you can call the `useMonitoring` hook
 * to use the different monitoring methods.
 */
export function MonitoringProvider({
  adapter,
  children,
}: PropsWithChildren<MonitoringProviderProps>) {
  return <MonitoringContext.Provider value={adapter}>{children}</MonitoringContext.Provider>;
}
