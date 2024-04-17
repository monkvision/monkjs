import { PropsWithChildren } from 'react';
import { AnalyticsContext } from './context';
import { AnalyticsAdapter } from '../adapters';

/**
 * Prop types of the AnalyticsProvider component.
 */
export interface AnalyticsProviderProps {
  /**
   * The Analytics Adapter used in the project. You can either use one of the adapters provided by Monk or create your
   * own adapter by implementing the interface.
   */
  adapter: AnalyticsAdapter;
}

/**
 * Context provider for the Analytics Context. Place this at the root of your application in order to have access to
 * the analytics features in your app. Inside the children of this component, you can call the `useAnalytics` hook
 * to use the different Analytics methods.
 */
export function AnalyticsProvider({
  adapter,
  children,
}: PropsWithChildren<AnalyticsProviderProps>) {
  return <AnalyticsContext.Provider value={adapter}>{children}</AnalyticsContext.Provider>;
}
