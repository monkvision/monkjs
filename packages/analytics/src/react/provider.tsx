import { PropsWithChildren, useMemo } from 'react';
import { AnalyticsContext } from './context';
import { AnalyticsAdapter, CompositeAnalyticsAdapter } from '../adapters';

/**
 * Prop types of the AnalyticsProvider component.
 */
export interface AnalyticsProviderProps {
  /**
   * The Analytics Adapter used in the project. You can either use one of the adapters provided by Monk or create your
   * own adapter by implementing the interface. It is the primary adapter, used to return values (e.g. `getUserId`).
   */
  adapter: AnalyticsAdapter;
  /**
   * Additional Analytics Adapters that receive every analytics call alongside the primary `adapter`. The array
   * should be stable between renders (define it outside of your components or memoize it).
   */
  additionalAdapters?: AnalyticsAdapter[];
}

/**
 * Context provider for the Analytics Context. Place this at the root of your application in order to have access to
 * the analytics features in your app. Inside the children of this component, you can call the `useAnalytics` hook
 * to use the different Analytics methods.
 */
export function AnalyticsProvider({
  adapter,
  additionalAdapters,
  children,
}: PropsWithChildren<AnalyticsProviderProps>) {
  const value = useMemo(
    () =>
      additionalAdapters && additionalAdapters.length > 0
        ? new CompositeAnalyticsAdapter([adapter, ...additionalAdapters])
        : adapter,
    [adapter, additionalAdapters],
  );

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}
